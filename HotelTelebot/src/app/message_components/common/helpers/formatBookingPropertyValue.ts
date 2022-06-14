import { DATE_SHORT, DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { BookingDto, FormatOptions } from '~/common/types';
import { sourceToText } from '~/common/utils/constants_mapper';
import { formatDate } from '~/common/utils/dates';

type BookingProperty = keyof BookingDto;
type PropToFormatter = Partial<Record<BookingProperty, Function>>;

const identity = (i) => i;
const toShortDate = (val) => formatDate(val, DATE_SHORT);
const toLocalizedDatetime = (val) => formatDate(val, DATETIME_DAYOFWEEK_MOMENTJS);

const propToFormatter: PropToFormatter = {
  updatedAt: toLocalizedDatetime,
  createdAt: toLocalizedDatetime,
  bookedAt: toLocalizedDatetime,
  totalUahCoins: (value) => (Number(value) / 100).toFixed(2),
  source: (val, options) => sourceToText(val, options),
  startDate: toShortDate,
  endDateExclusive: toShortDate
};

const formatBookingPropertyValue = (property: BookingProperty | string, value, options?: FormatOptions): string => {
  const formatFunction = propToFormatter[property] ?? identity;
  return formatFunction(value, options);
};

export { formatBookingPropertyValue };
