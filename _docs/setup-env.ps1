# Создаёт .env для Docker-базы: свободный порт, надёжные пароли и секрет.
# Старый .env сохраняется рядом копией. Пароли на экран не выводятся.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $root ".env"

function New-RandomString([int]$length) {
  $chars = [char[]]"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
  $bytes = New-Object byte[] $length
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  -join ($bytes | ForEach-Object { $chars[$_ % $chars.Length] })
}

function Test-PortFree([int]$port) {
  try {
    $l = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    $l.Start(); $l.Stop(); return $true
  } catch { return $false }
}

# Значения, которые уже были в старом .env (ключи почты и OpenAI), переносим
$keep = @{}
if (Test-Path $envPath) {
  $backup = "$envPath.backup-" + (Get-Date -Format "yyyyMMdd-HHmmss")
  Copy-Item $envPath $backup
  Write-Host "Старый .env сохранён: $backup" -ForegroundColor Yellow
  foreach ($line in Get-Content $envPath) {
    if ($line -match '^(RUSENDER_[A-Z_]+|OPENAI_[A-Z_]+)=(.*)$') { $keep[$matches[1]] = $matches[2] }
  }
}

$port = 5433
while (-not (Test-PortFree $port)) { $port++ }
Write-Host "Порт для базы в контейнере: $port (5432 занят локальным Postgres)" -ForegroundColor Green

$user = "yarchinvest"
$db = "yarchinvest"
$pass = New-RandomString 32
$secret = New-RandomString 48

function Val($k) { if ($keep.ContainsKey($k)) { $keep[$k] } else { "" } }

$content = @"
# База данных в Docker
POSTGRES_USER=$user
POSTGRES_PASSWORD=$pass
POSTGRES_DB=$db
DB_PORT=$port
DATABASE_URL=postgresql://${user}:${pass}@localhost:${port}/${db}

# Авторизация (Better Auth)
BETTER_AUTH_SECRET=$secret
BETTER_AUTH_URL=http://localhost:3000

# Почта RuSender (если ключа нет, код подтверждения печатается в терминал)
RUSENDER_API_KEY=$(Val 'RUSENDER_API_KEY')
RUSENDER_API_URL=$(Val 'RUSENDER_API_URL')
RUSENDER_FROM_EMAIL=$(Val 'RUSENDER_FROM_EMAIL')
RUSENDER_FROM_NAME=$(Val 'RUSENDER_FROM_NAME')

# OpenAI через прокси
OPENAI_API_KEY=$(Val 'OPENAI_API_KEY')
OPENAI_MODEL=$(if (Val 'OPENAI_MODEL') { Val 'OPENAI_MODEL' } else { 'gpt-4o-mini' })
OPENAI_PROXY_URL=$(Val 'OPENAI_PROXY_URL')
OPENAI_BASE_URL=$(Val 'OPENAI_BASE_URL')
"@

[System.IO.File]::WriteAllText($envPath, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Готово: $envPath" -ForegroundColor Green
Write-Host "Дальше: docker compose up -d" -ForegroundColor Cyan
