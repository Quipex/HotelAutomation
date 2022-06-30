import { routesV1 } from '~/common/maps';
import { RoomDto } from '~/common/types';
import api from '../api';
import { rv1 } from './helpers';

const { byNumber$get, setNote$patch, note$get } = routesV1.rooms;

const fetchRoomByNumber = async (roomNumber: number) => {
  const {
    path: fullPath, method, compactPath: { withPathVariable }
  } = rv1(byNumber$get);
  const path = withPathVariable(fullPath, roomNumber.toString());
  return await api.call(path, { method }) as RoomDto;
};

const getNote = async (roomNumber: string) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(note$get);
  const params = getQueryParams({ roomNumber });
  return (await api.call(path, { method, params })) as { notes: string };
};

const setNote = async (roomNumber: string, noteText: string) => {
  const { path, method, compactPath: { getData } } = rv1(setNote$patch);
  const data = getData({ roomNumber, noteText });
  await api.call(path, { method, data });
};

export default { fetchRoomByNumber, getNote, setNote };
