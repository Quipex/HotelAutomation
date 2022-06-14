import { BookingDto } from '~/common/types';

type BookingProperty = keyof BookingDto;
type PropsToNames = Record<BookingProperty, string>;

const propsToNames: PropsToNames = {
  id: 'Id',
  startDate: 'Приезд',
  endDateExclusive: 'Отъезд',
  prepaid: 'Пред оплачено',
  totalUahCoins: 'Сумма',
  numberOfGuests: 'Количество гостей',
  notes: 'Заметки',
  groupId: 'Общий id',
  source: 'Источник',
  cancelled: 'Отменено',
  room: 'Комната',
  client: 'Гость',
  living: 'Проживает',
  createdAt: 'Добавлено',
  updatedAt: 'Обновлено',
  bookedAt: 'Забронировано',
  carPlates: 'Номера машин',
  prepaymentRemindings: 'Напоминания предоплаты'
};

const translateBookingProperty = (propName: BookingProperty | string) => propsToNames[propName] ?? propName;

export { translateBookingProperty };
