import { createPathReplacer } from '~/maps/routes/helpers';

export default {
  /**
   * Get room by number
   */
  byNumber$get: {
    relativePath: 'number/:number',
    withPathVariable: createPathReplacer(':number')
  },
  /**
   * Set note for the room
   */
  setNote$patch: {
    relativePath: 'note',
    getData: (data: { noteText: string, roomNumber: string }) => data
  },
  /**
   * Get note of the room
   */
  note$get: {
    relativePath: 'note',
    getQueryParams: (params: { roomNumber: string }) => params
  }
};
