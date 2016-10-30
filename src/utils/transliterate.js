const charCyrillicToLatinMap = {
  Ё: 'YO',
  Ц: 'TS',
  У: 'U',
  К: 'K',
  Е: 'E',
  Н: 'N',
  Г: 'G',
  Ш: 'SH',
  Щ: 'SCH',
  З: 'Z',
  Х: 'H',
  Ъ: "'",
  ё: 'yo',
  й: 'y',
  Й: 'Y',
  ц: 'ts',
  у: 'u',
  к: 'k',
  е: 'e',
  н: 'n',
  г: 'g',
  ш: 'sh',
  щ: 'sch',
  з: 'z',
  х: 'h',
  ъ: "'",
  Ф: 'F',
  Ы: 'I',
  В: 'V',
  А: 'a',
  П: 'P',
  Р: 'R',
  О: 'O',
  Л: 'L',
  Д: 'D',
  Ж: 'ZH',
  Э: 'E',
  ф: 'f',
  ы: 'i',
  в: 'v',
  а: 'a',
  A: 'А',
  п: 'p',
  р: 'r',
  о: 'o',
  л: 'l',
  д: 'd',
  ж: 'zh',
  э: 'e',
  Я: 'Ya',
  Ч: 'CH',
  С: 'S',
  М: 'M',
  И: 'I',
  Т: 'T',
  Ь: "'",
  Б: 'B',
  Ю: 'YU',
  я: 'ya',
  ч: 'ch',
  с: 's',
  м: 'm',
  и: 'i',
  т: 't',
  ь: "'",
  б: 'b',
  ю: 'yu',
};
const charLatinToCyrillic = {
  A: 'А',
  YO: 'Ё',
  I: 'И',
  TS: 'Ц',
  U: 'У',
  K: 'К',
  E: 'Э',
  N: 'Н',
  G: 'Г',
  SH: 'Ш',
  SCH: 'Щ',
  Z: 'З',
  H: 'Х',
  "'": 'ь',
  y: 'й',
  Y: 'Й',
  yo: 'ё',
  i: 'и',
  ts: 'ц',
  u: 'у',
  k: 'к',
  e: 'э',
  n: 'н',
  g: 'г',
  sh: 'ш',
  sch: 'щ',
  z: 'з',
  h: 'х',
  F: 'Ф',
  V: 'В',
  a: 'а',
  P: 'П',
  R: 'Р',
  O: 'О',
  L: 'Л',
  D: 'Д',
  ZH: 'Ж',
  f: 'ф',
  v: 'в',
  p: 'п',
  r: 'р',
  o: 'о',
  l: 'л',
  d: 'д',
  zh: 'ж',
  Ya: 'Я',
  CH: 'Ч',
  S: 'С',
  M: 'М',
  T: 'Т',
  B: 'Б',
  YU: 'Ю',
  ya: 'я',
  ch: 'ч',
  s: 'с',
  m: 'м',
  t: 'т',
  b: 'б',
  yu: 'ю',
};

export function transliterate(word) {
  if (word) {
    return word.split('').map((char) => {
      return charCyrillicToLatinMap[char] || char;
    }).join('');
  }

  return word;
}

export function transliterateGroupName(group) {
  if (group) {
    if (!group.match(/[A-Za-z]+.*/)) {
      return transliterate(group);
    }
  }

  return group;
}

export function latinToCyrillic(word) {
  if (word) {
    return word.split('').map((char) => {
      return charLatinToCyrillic[char] || char;
    }).join('');
  }

  return word;
}

export function latinToCyrillicGroupName(group) {
  if (group) {
    if (group.match(/[A-Za-z]+.*/)) {
      return latinToCyrillic(group);
    }
  }
  return latinToCyrillic(group);
}
