export const EMPRESA_WHATSAPP = "5500000000000";
export const PRECO_MENSAL = 59;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function whatsappLink(numero: string, mensagem: string) {
  const digits = onlyDigits(numero);
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(mensagem)}`;
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const [y, m, d] = value.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function addMonths(dateIso: string, months: number) {
  const date = new Date(`${dateIso.slice(0, 10)}T12:00:00`);
  date.setMonth(date.getMonth() + months);
  return date;
}

export function daysUntil(date: Date) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / 86400000);
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
