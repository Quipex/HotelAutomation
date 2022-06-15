import { FormatOptions } from '~/common/types';

type FromStatusFn = (args: {
  living: boolean, prepaid: boolean, cancelled: boolean
}, options?: FormatOptions) => string;

const BookingStatus: FromStatusFn = ({ living, prepaid, cancelled }, options) => {
  const { emojified } = options ?? {};
  if (cancelled) {
    return `${emojified ? '❌ ' : ''}Отмена${emojified ? ' ❌' : ''}`;
  }
  if (living) {
    return `${emojified ? '🟩 ' : ''}Проживает${emojified ? ' 🟩' : ''}`;
  }
  if (prepaid) {
    return `${emojified ? '🟨 ' : ''}Предоплата${emojified ? ' 🟨' : ''}`;
  }
  return `${emojified ? '🟥 ' : ''}Без предоплаты${emojified ? ' 🟥' : ''}`;
};

export default BookingStatus;
