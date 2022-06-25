import { BookingCreationPayload } from '~/types/routes/routes.v1.types';
import { createPathReplacer } from '~/maps/routes/helpers';

export default {
  /**
   * Fetch pms and get all bookings
   */
  index$post: {
    relativePath: '/'
  },
  /**
   * Get all fetched bookings without fetching
   */
  cached$get: {
    relativePath: 'cached'
  },
  /**
   * Get bookings that arrive at particular date
   */
  arrive$get: {
    relativePath: 'arrive',
    /**
     * @param params config
     * @param params.on date formatted as YYYY-MM-DD
     */
    getQueryParams: (params: { on: string }) => params
  },
  /**
   * Get bookings that were added after date
   * @param [after: string] date formatted as YYYY-MM-DD
   */
  added$get: {
    relativePath: 'added',
    /**
     * @param params config
     * @param params.after date formatted as YYYY-MM-DD
     */
    getQueryParams: (params: { after: string }) => params
  },
  /**
   * Get booking by id
   */
  byId$get: {
    relativePath: 'id/:id',
    withPathVariable: createPathReplacer(':id')
  },
  /**
   * Get bookings that are not paid and arrive after 'date'
   */
  notPaid$get: {
    relativePath: 'not_paid',
    /**
     * @param params config
     * @param params.arrive_after date formatted as YYYY-MM-DD
     * @param [params.expired] should display only expired/not bookings
     * @param [params.wereReminded] should display that were reminded/not bookings
     */
    getQueryParams: (params: { arrive_after: string, expired?: boolean, wereReminded?: boolean }) => params
  },
  /**
   * Fetch pms
   */
  sync$put: {
    relativePath: 'sync'
  },
  /**
   * Mark booking as confirmed (person made prepayment)
   */
  confirmPrepayment$put: {
    relativePath: 'confirm_prepayment',
    getData: (data: { bookingId: string }) => data
  },
  /**
   * Mark booking as confirmed living (person moved in)
   */
  confirmLiving$put: {
    relativePath: 'confirm_living',
    getData: (data: { bookingId: string }) => data
  },
  /**
   * Mark booking that person was reminded of prepayment
   */
  remindedPrepayment$put: {
    relativePath: 'reminded_prepayment',
    getData: (data: { bookingId: string }) => data
  },
  /**
   * Create booking
   */
  create$put: {
    relativePath: 'create',
    getData: (data: BookingCreationPayload) => data
  },
  /**
   * Cancel booking
   */
  cancel$put: {
    relativePath: 'cancel',
    getData: (data: { bookingId: string }) => data
  },
  /**
   * Find bookings that should arrive already but not marked as living for some reason
   */
  livingNotMarked$get: {
    relativePath: 'living_not_marked',
    getQueryParams: (params: { date: string }) => params
  },
  /**
   * Set note for the booking
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
  },
  owner: {
    /**
     * Get bookings by owner (customer/guest) id
     */
    byId$get: {
      relativePath: 'id/:id',
      withPathVariable: createPathReplacer(':id')
    }
  }
};
