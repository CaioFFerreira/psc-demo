export default function validateCnpj(cnpj: string) {
  let b: any = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let c: any = String(cnpj).replace(/[^\d]/g, "");

  if (c.length !== 14) return false;

  if (/0{14}/.test(c)) return false;

  for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
  if (c[12] != ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  for (var j = 0, n = 0; j <= 12; n += c[j] * b[j++]);
  if (c[13] != ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  return true;
}
