import moment from 'moment';
import PmsBookingEntity from '../../../api/entities/PmsBookingEntity';
import BriefBooking from './BriefBooking';

function DetailedBooking(
  entity: PmsBookingEntity
): string {
  return (
    BriefBooking(entity)
    + (entity.remindedPrepayment ? `\nНапомнил за предоплату ${moment(entity.remindedPrepayment).format('lll')}` : '')
  );
}

export default DetailedBooking;
