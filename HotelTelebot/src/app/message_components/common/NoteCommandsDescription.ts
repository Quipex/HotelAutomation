import { COMMAND_SET_BOOKING_NOTE, COMMAND_SET_CLIENT_NOTE } from '~/common/constants/commands';
import { Entity } from '~/common/types';

const NoteCommandsDescription = (id: string, entity: Entity): string => {
  switch (entity) {
    case 'client': {
      return `Изменить: <code>/${COMMAND_SET_CLIENT_NOTE} ${id} &lt;текст&gt;</code>`;
    }
    case 'booking': {
      return `Изменить: <code>/${COMMAND_SET_BOOKING_NOTE} ${id} &lt;текст&gt;</code>`;
    }
    default: {
      return `Неизвестная сущность: ${entity}`;
    }
  }
};

export default NoteCommandsDescription;
