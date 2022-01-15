import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { PmsClientEntity } from '~/domain/clients/ClientPmsModel';

const latin = /^[a-zA-Z\s]+$/;
const transUa = new CyrillicToTranslit({ preset: 'uk' });
const transRu = new CyrillicToTranslit({ preset: 'ru' });

function translateClientName(client: PmsClientEntity): PmsClientEntity {
  const fullNameOrig = `${client.lastName} ${client.firstName}`;
  let fullNameEn; let fullNameRu; let
    fullNameUa;
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
    ...client,
    fullNameOrig,
    fullNameEn,
    fullNameRu,
    fullNameUa
  };
}

export { translateClientName };
