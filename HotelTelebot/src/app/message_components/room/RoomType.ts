import { RoomTypeDto } from '~/common/types';

const RoomType = ({ name, maxAdults, preferredAdults }: RoomTypeDto) => {
  return [
    `Номер : ${name}`,
    `Макс. взрослых : ${maxAdults}`,
    `Рек. взрослых : ${preferredAdults}`
  ].join('\n');
};

export default RoomType;
