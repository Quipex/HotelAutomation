import { BookingDto } from '~/common/types';
import { daysBetween } from '~/common/utils/dates';
import { BookingStatus, ShortNote } from '../common';
import { formatBookingPropertyValue, getRelativeStatusMessage, translateBookingProperty } from '../common/helpers';

const b = (text) => `<b>${text}</b>`;

const BriefBooking = (booking: BookingDto, emojified: boolean): string => {
  const {
    startDate,
    endDateExclusive,
    room: { realRoomNumber },
    source,
    living,
    cancelled,
    prepaid,
    client: { fullNameOrig },
    updatedAt,
    id,
    totalUahCoins,
    prepaymentRemindings,
    notes
  } = booking;

  const statusText = BookingStatus({
    living,
    cancelled,
    prepaid,
    prepaymentRemindings
  }, { emojified });

  const format: typeof formatBookingPropertyValue = (prop, val) => formatBookingPropertyValue(prop, val, { emojified });
  const prop: typeof translateBookingProperty = (propName) => translateBookingProperty(propName, emojified);
  const arriveText = format('startDate', startDate);
  const departText = format('endDateExclusive', endDateExclusive);
  const daysText = daysBetween(startDate, endDateExclusive);

  const noteSection: string[] = notes
    ? ['', `${prop('notes')}: ${b(ShortNote(notes))}`]
    : [];

  return [
    `${prop('client')}:  ${fullNameOrig}`,
    `${prop('dates')}:  С ${b(arriveText)} по ${b(departText)}. ${b(daysText)} дней.`,
    `${prop('room')}: <b>№${realRoomNumber}</b>`,
    `${prop('source')}: <b>${format('source', source)}</b>`,
    `${prop('status')}: <b>${statusText}</b>`,
    `${prop('totalUahCoins')}: <b>${format('totalUahCoins', totalUahCoins)}</b>`,
    '',
    `<i>${getRelativeStatusMessage(booking)}</i>`,
    ...noteSection,
    '',
    `<i>${prop('updatedAt')}: ${format('updatedAt', updatedAt)}</i>`,
    `<code>/id ${id}</code>`
  ].join('\n');
};

export default BriefBooking;
