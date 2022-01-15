import moment from 'moment';
import PmsClientEntity from '../../../api/entities/PmsClientEntity';

function BriefClientMessage(
  {
    id,
    fullNameRu,
    phone,
    createdDate
  }: PmsClientEntity,
  childrenMessage?: string
): string {
  return (
    `🧑️ ${fullNameRu}\n`
    + `📞 ${phone}\n${
      childrenMessage ? `${childrenMessage}\n----\n` : '\n'
    }<i>Обновлено ${moment(createdDate).format('llll')}\n</i>`
    + `<i>/cl_id ${id}</i>`
  );
}

export default BriefClientMessage;
