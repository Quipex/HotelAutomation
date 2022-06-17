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

async function findClient(id: ClientId): Promise<ClientModel | undefined> {
  const clientsRepo = getRepository(ClientModel);
  return clientsRepo.findOneBy({ id });
}

export {
  searchClients,
  findClient
};
