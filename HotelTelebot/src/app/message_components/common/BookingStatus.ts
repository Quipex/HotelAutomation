import { FormatOptions, PrepaymentRemindingsDto } from '~/common/types';

type FromStatusFn = (args: {
  living: boolean, prepaid: boolean, cancelled: boolean, prepaymentRemindings: PrepaymentRemindingsDto[]
}, options?: FormatOptions) => string;

const BookingStatus: FromStatusFn = ({ living, prepaid, cancelled, prepaymentRemindings }, options) => {
  const { emojified } = options ?? {};
  if (cancelled) {
    return `${emojified ? '❌ ' : ''}Отмена${emojified ? ' ❌' : ''}`;
  }
  if (living) {
    return `${emojified ? '✅ ' : ''}Проживает`;
  }
  if (prepaid) {
    return `${emojified ? '☑ ' : ''}Предоплата`;
  }
  return `${emojified ? '❗ ' : ''}Без предоплаты (${prepaymentRemindings.length ? 'напоминали' : 'нужно напомнить'})`;
};

export default BookingStatus;
