import { FormatOptions } from '~/common/types';

const sourceToText = (source: string, options?: FormatOptions): string => {
  const { emojified } = options ?? {};
  switch (source.toUpperCase()) {
    case 'EASYMS':
    case 'FRONT_DESK':
      return `${emojified ? '🟣 ' : ''}Напрямую`;
    case 'BOOKING':
      return `${emojified ? '🔵 ' : ''}Booking`;
    default:
      return `${emojified ? '⚠ ' : ''}Неизвестный (${source})${emojified ? ' ⚠' : ''}`;
  }
};

export { sourceToText };
