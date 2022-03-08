import moment from 'moment';

function formatDate(date: Date): string {
  return moment(date).format('YYYY/MM/DD');
}

export { formatDate };
