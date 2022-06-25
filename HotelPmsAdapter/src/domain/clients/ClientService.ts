import { ClientModel } from '~/domain/clients/ClientModel';
import * as ClientRepository from './ClientRepository';

const findClients = async (name: string): Promise<ClientModel[]> => ClientRepository.searchClients(name);

const findClientById = async (id: string): Promise<ClientModel | undefined> => ClientRepository.findClient(id);

const setNote = async (id: string, text: string) => ClientRepository.setNote(id, text);

const getNote = async (id: string) => ClientRepository.getNote(id);

export default {
  findClients,
  findClientById,
  setNote,
  getNote
};
