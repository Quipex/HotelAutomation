import { Entity } from '~/common/types';
import { sanitizeHtmlDiamonds } from '~/common/utils/string';
import NoteCommandsDescription from './NoteCommandsDescription';

type Context = {
  entityId: string,
  entity: Entity
};

const NoteMenu = (notes: string, { entityId, entity }: Context) => {
  const sanitizedNotes = sanitizeHtmlDiamonds(notes);
  const currentNote = notes ? `Текущая заметка:\n${notes}` : 'Заметки отсутствуют...';
  const arrTextToCopy = notes ? ['', `Копировать: <code>${sanitizedNotes}</code>`, ''] : [''];
  return [
    currentNote,
    ...arrTextToCopy,
    NoteCommandsDescription(entityId, entity)
  ].join('\n');
};

export default NoteMenu;
