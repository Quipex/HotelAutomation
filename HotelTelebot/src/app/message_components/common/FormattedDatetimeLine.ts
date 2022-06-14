import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';

const FormattedDatetimeLine = (dateTime: string) => {
  const formattedDatetime = formatDate(dateTime, DATETIME_DAYOFWEEK_MOMENTJS);
  return `<i>${formattedDatetime}</i>`;
};

export default FormattedDatetimeLine;
