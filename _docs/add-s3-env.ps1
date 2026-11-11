# Дописывает в .env настройки хранилища (MinIO). Существующие значения не трогает.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $root ".env"
if (-not (Test-Path $envPath)) { throw "Нет файла .env. Сначала выполните _docs\setup-env.ps1" }
$text = Get-Content $envPath -Raw

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

if ($text -match '(?m)^S3_ACCESS_KEY=.+') {
  Write-Host "Настройки S3 уже есть в .env, ничего не меняю." -ForegroundColor Yellow
  return
}

$port = 9000
while (-not (Test-PortFree $port)) { $port++ }
$console = $port + 1
while (-not (Test-PortFree $console)) { $console++ }
$access = "yarch" + (New-RandomString 10)
$secret = New-RandomString 32

$block = @"

# Файловое хранилище S3 (локально MinIO)
S3_ENDPOINT=http://localhost:$port
S3_REGION=us-east-1
S3_BUCKET=yarchinvest-media
S3_ACCESS_KEY=$access
S3_SECRET_KEY=$secret
S3_PORT=$port
S3_CONSOLE_PORT=$console
S3_FORCE_PATH_STYLE=true
S3_AUTO_CREATE_BUCKET=true
"@
[System.IO.File]::AppendAllText($envPath, $block, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Добавлено в .env. Порт хранилища: $port, консоль: http://localhost:$console" -ForegroundColor Green
Write-Host "Дальше: docker compose up -d" -ForegroundColor Cyan
