// noinspection SqlResolve

import { getRepository } from '../helpers/orm';
import { ClientId, ClientModel } from './ClientModel';

const searchClients = async (name: string): Promise<ClientModel[]> => {
  const clientsRepo = getRepository(ClientModel);
  return clientsRepo.query(`
    SELECT *
    FROM clients cl
    WHERE findByName(cl, $1) > 0.1
    ORDER BY (findByName(cl, $1)) DESC
  `, [name]);
};

const findClient = async (id: ClientId): Promise<ClientModel | undefined> => {
  const clientsRepo = getRepository(ClientModel);
  return clientsRepo.findOneBy({ id });
};

const setNote = async (id: ClientId, text: string) => {
  const clientsRepo = getRepository(ClientModel);
  await clientsRepo.update({ id }, { notes: text });
};

const getNote = async (id: string) => {
  const clientsRepo = getRepository(ClientModel);
  const { notes } = await clientsRepo.findOne({
    where: { id },
    select: ['id', 'notes']
  });
  return { notes };
};

export {
  searchClients,
  findClient,
  setNote,
  getNote
};
