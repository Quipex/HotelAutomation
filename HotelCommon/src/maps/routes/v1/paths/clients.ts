import { createPathReplacer } from '~/maps/routes/helpers';

export default {
  /**
   * Search clients
   */
  search$post: {
    relativePath: 'search',
    getData: (data: { name: string }) => data
  },
  /**
   * Get client by id
   */
  byId$get: {
    relativePath: 'id/:id',
    withPathVariable: createPathReplacer(':id')
  },
  /**
   * Set note for the client
   */
  setNote$patch: {
    relativePath: 'note',
    getData: (data: { noteText: string, id: string }) => data
  },
  /**
   * Get note of a booking
   */
  note$get: {
    relativePath: 'note',
    getQueryParams: (params: { id: string }) => params
  }
};
