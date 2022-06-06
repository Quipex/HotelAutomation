import { mapBookingModel2dto } from '~/common/mappings/dto/bookingModel2dto';
import { dateToIsoString } from '~/common/utils/dates';
import { PrepaymentRemindingsDto } from '~/common/types';
import { PrepaymentRemindingsModel } from '~/domain/prepayment_remindings/PrepaymentRemindingsModel';

const mapPrepaymentRemindingModel2dto = (
  prepaymentRemindingModel: PrepaymentRemindingsModel
): PrepaymentRemindingsDto => {
  const { createdAt, booking } = prepaymentRemindingModel;
  return {
    createdAt: dateToIsoString(createdAt),
    booking: booking ? mapBookingModel2dto(booking) : undefined
  };
};

export { mapPrepaymentRemindingModel2dto };
