/* eslint-disable */
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { ClientDto } from '~/common/types';
import { formatDate } from '~/common/utils/dates';
import { ShortNote } from '~@components';

const b = (text) => `<b>${text}</b>`;

function BriefClientMessage(
  {
    id,
    fullNameOrig,
    phone,
    createdAt,
    notes
  }: ClientDto,
  childrenMessage?: string
): string {
  return (
    `🧑️ :  ${fullNameOrig}\n`
    + (phone ? `📞 :  <code>${phone}</code>\n` : '')
    + (childrenMessage ? `${childrenMessage}\n` : '\n')
    + (notes ? `\n📝 Заметки: ${b(ShortNote(notes))}\n` : '')
    + `<i>Обновлено ${formatDate(createdAt, DATETIME_DAYOFWEEK_MOMENTJS)}\n</i>`
    + `<code>/cl_id ${id}</code>`
  );
}

export default BriefClientMessage;
