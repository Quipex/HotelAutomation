import { ClientModel } from '~/domain/clients/ClientModel';
import * as ClientRepository from './ClientRepository';

async function getClients(): Promise<ClientModel[]> {
  throw new Error('Not implemented');
}

async function findClients(name: string): Promise<ClientModel[]> {
  return ClientRepository.searchClients(name);
}

async function findClientById(id: string): Promise<ClientModel | undefined> {
  return ClientRepository.findClient(id);
}

export default {
  getClients,
  findClients,
  findClientById
};
