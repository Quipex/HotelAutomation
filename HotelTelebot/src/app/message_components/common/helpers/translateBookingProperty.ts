import { BookingDto } from '~/common/types';

type BookingProperty = keyof BookingDto | string;
type PropsToNames = Record<BookingProperty, { text: string, emojified: string }>;

const propsToNames: PropsToNames = {
  id: { text: 'Id', emojified: 'Id' },
  startDate: { text: 'Приезд', emojified: '📥 Приезд' },
  endDateExclusive: { text: 'Отъезд', emojified: '📤 Отъезд' },
  prepaid: { text: 'Предоплачено', emojified: '❔ Предоплачено' },
  totalUahCoins: { text: 'Сумма', emojified: '💳 Сумма' },
  numberOfGuests: { text: 'Кол-во гостей', emojified: '👨‍👩‍👧‍👦 Кол-во' },
  notes: { text: 'Заметки', emojified: '📝 Заметки' },
  groupId: { text: 'Общий id', emojified: '🔗 Общий id' },
  source: { text: 'Источник', emojified: '💠 Источник' },
  cancelled: { text: 'Отменено', emojified: '❔ Отменено' },
  room: { text: 'Комната', emojified: '🚪 Комната' },
  client: { text: 'Гость', emojified: '👨 Гость' },
  living: { text: 'Проживает', emojified: '❔ Проживает' },
  createdAt: { text: 'Добавлено', emojified: 'Добавлено' },
  updatedAt: { text: 'Обновлено', emojified: 'Обновлено' },
  bookedAt: { text: 'Забронировано', emojified: 'Забронировано' },
  carPlates: { text: 'Номера машин', emojified: '🚗 Номера машин' },
  prepaymentRemindings: { text: 'Напоминания предоплаты', emojified: '💬 Напоминания предоплаты' },
  status: { text: 'Статус', emojified: 'Статус' },
  dates: { text: 'Даты', emojified: '🗓' }
};

type PropName = keyof typeof propsToNames;

const translateBookingProperty = (propName: PropName | string, emojified?: boolean) => {
  return propsToNames[propName][emojified ? 'emojified' : 'text'] ?? propName;
};

export { translateBookingProperty };
