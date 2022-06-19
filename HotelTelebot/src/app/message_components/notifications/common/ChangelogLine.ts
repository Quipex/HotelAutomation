import { formatOptionalBookingPropertyValue, translateBookingProperty } from '~/app/message_components/common/helpers';
import { BookingNotificationChangelogLineDto } from '~/common/types';

const ChangelogLine = ({ property, newVal, oldVal }: BookingNotificationChangelogLineDto) => {
  const propertyName = translateBookingProperty(property);
  const formattedOldVal = formatOptionalBookingPropertyValue(property, oldVal);
  const formattedNewVal = formatOptionalBookingPropertyValue(property, newVal);
  return `<b>${propertyName}</b>: '<del>${formattedOldVal}</del>' -&gt; '${formattedNewVal}'`;
};

export default ChangelogLine;
