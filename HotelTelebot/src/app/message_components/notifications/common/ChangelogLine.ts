import { formatBookingPropertyValue, translateBookingProperty } from '~/app/message_components/common/helpers';
import { BookingNotificationChangelogLineDto } from '~/common/types';

const ChangelogLine = ({ property, newVal, oldVal }: BookingNotificationChangelogLineDto) => {
  const propertyName = translateBookingProperty(property);
  const formattedOldVal = formatBookingPropertyValue(property, oldVal);
  const formattedNewVal = formatBookingPropertyValue(property, newVal);
  return `<b>${propertyName}</b>: '<del>${formattedOldVal}</del>' -&gt; '${formattedNewVal}'`;
};

export default ChangelogLine;
