/* eslint-disable */
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { ClientDto } from '~/common/types';
import { formatDate } from '~/common/utils/dates';

function BriefClientMessage(
  {
    id,
    fullNameOrig,
    phone,
    createdAt
  }: ClientDto,
  childrenMessage?: string
): string {
  return (
    `🧑️ :  ${fullNameOrig}\n`
    + (phone ? `📞 :  <code>${phone}</code>\n` : '')
    + (childrenMessage ? `${childrenMessage}\n` : '\n')
    + `<i>Обновлено ${formatDate(createdAt, DATETIME_DAYOFWEEK_MOMENTJS)}\n</i>`
    + `<code>/cl_id ${id}</code>`
  );
}

export default BriefClientMessage;
