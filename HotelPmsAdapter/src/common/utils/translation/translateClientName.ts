import CyrillicToTranslit from 'cyrillic-to-translit-js';

const latin = /^[a-zA-Z\s]+$/;
const transUa = CyrillicToTranslit({ preset: 'uk' });
const transRu = CyrillicToTranslit({ preset: 'ru' });

type TranslateClientName = (firstName: string, lastName: string) => {
  fullNameOrig: string,
  fullNameEn: string,
  fullNameRu: string,
  fullNameUa: string
};

const translateClientName: TranslateClientName = (firstName, lastName) => {
  const fullNameOrig = `${lastName} ${firstName}`;
  let fullNameEn: string;
  let fullNameRu: string;
  let fullNameUa: string;
  if (latin.test(fullNameOrig)) {
    fullNameEn = fullNameOrig;
    fullNameRu = transRu.reverse(fullNameOrig);
    fullNameUa = transUa.reverse(fullNameOrig);
  } else {
    fullNameRu = fullNameOrig;
    fullNameUa = fullNameOrig;
    fullNameEn = transRu.transform(fullNameRu);
  }

  return {
    fullNameOrig,
    fullNameEn,
    fullNameRu,
    fullNameUa
  };
};

export { translateClientName };
