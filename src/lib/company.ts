// Реквизиты компании. Незаполненные поля в подвале и документах не придумываем.
export const COMPANY = {
  name: "ООО «Стормикс»",
  inn: "3700002256",
  ogrn: "", // ЗАПОЛНИТЬ
  address: "", // ЗАПОЛНИТЬ
  email: "support@yarchinvest.online",
  phone: "", // ЗАПОЛНИТЬ
};

export function requisitesLines(): string[] {
  const lines = [`${COMPANY.name}`, `ИНН: ${COMPANY.inn}`];
  if (COMPANY.ogrn) lines.push(`ОГРН: ${COMPANY.ogrn}`);
  if (COMPANY.address) lines.push(`Адрес: ${COMPANY.address}`);
  lines.push(`Email: ${COMPANY.email}`);
  if (COMPANY.phone) lines.push(`Телефон: ${COMPANY.phone}`);
  return lines;
}
