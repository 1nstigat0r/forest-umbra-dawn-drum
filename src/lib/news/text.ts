export function isIsraeliVoice(speaker: string, body: string, url = "") {
  const t = `${speaker} ${body} ${url}`;
  if (
    /אבו עלי|כאן 11|דסק ערבים|ynet|עמית סגל|יחזקאלי|jpost|jerusalempost|timesofisrael|israelhayom|mako\.|walla\.|n12|kan11|inn\.co/i.test(
      t,
    )
  ) {
    return true;
  }
  if (
    /^(נתניהו|שר הביטחון|משהב["״]ט|צה["״]ל|הלוי|זמיר|קץ|כץ|לשכת רמ["״]מ)$/.test(
      speaker.trim(),
    )
  ) {
    return true;
  }
  if (
    /נתניהו|שר הביטחון|לשכת רמ["״]מ|צה["״]ל הנחה|גורמים ישראליים/.test(body) &&
    !/עלי אלטאהר|תקיפ(?:ה|ות) ישראלית/.test(body)
  ) {
    return true;
  }
  return false;
}