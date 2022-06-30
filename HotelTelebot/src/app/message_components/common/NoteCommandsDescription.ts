import { COMMAND_SET_BOOKING_NOTE, COMMAND_SET_CLIENT_NOTE, COMMAND_SET_ROOM_NOTE } from '~/common/constants/commands';
import { Entity } from '~/common/types';

const generateCommand = (command, id) => {
  return `Изменить: <code>/${command} ${id} &lt;текст&gt;</code>`;
};

const NoteCommandsDescription = (id: string, entity: Entity): string => {
  switch (entity) {
    case 'client': {
      return generateCommand(COMMAND_SET_CLIENT_NOTE, id);
    }
    case 'booking': {
      return generateCommand(COMMAND_SET_BOOKING_NOTE, id);
    }
    case 'room': {
      return generateCommand(COMMAND_SET_ROOM_NOTE, id);
    }
    default: {
      return `Неизвестная сущность: ${entity}`;
    }
  }
};

export default NoteCommandsDescription;
