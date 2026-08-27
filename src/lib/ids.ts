import { randomUUID, randomInt } from "node:crypto";

export function genId(): string {
  return randomUUID();
}

const TRACKING_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function genTrackingCode(): string {
  let code = "VZ-";
  for (let i = 0; i < 6; i++) {
    code += TRACKING_ALPHABET[randomInt(TRACKING_ALPHABET.length)];
  }
  return code;
}

export function slugify(input: string): string {
  const trMap: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  const replaced = input.replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => trMap[ch] ?? ch);
  return replaced
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
