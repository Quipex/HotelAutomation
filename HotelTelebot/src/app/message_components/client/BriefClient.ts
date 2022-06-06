import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { ClientDto } from '~/common/types';
import { formatDate } from '~/common/utils/dates';

function BriefClientMessage(
  {
    id,
    fullNameRu,
    phone,
    createdAt
  }: ClientDto,
  childrenMessage?: string
): string {
  return (
    `🧑️ ${fullNameRu}\n`
    + `📞 ${phone}\n${
      childrenMessage ? `${childrenMessage}\n----\n` : '\n'
    }<i>Обновлено ${formatDate(createdAt, DATETIME_DAYOFWEEK_MOMENTJS)}\n</i>`
    + `<i>/cl_id ${id}</i>`
  );
}

export default BriefClientMessage;
