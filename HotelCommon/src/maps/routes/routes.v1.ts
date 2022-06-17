import { BookingCreationPayload } from '~/types/routes/routes.v1.types';
import { createPathReplacer } from './helpers/createPathReplacer';
import { enhanceWithUuids } from './helpers/enhanceWithUuids';
import { mapCompactToFullRoutes } from './helpers/mapCompactToFullRoutes';

const routesV1 = {
  '/': {
    /**
     * Hello
     */
    index$get: {
      relativePath: '/'
    }
  },
  bookings: {
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
     * Get bookings that arrive by specified unix date
     */
    arrive$get: {
      relativePath: 'arrive',
      getQueryParams: (params: { date: number }) => params
    },
    /**
     * Get bookings that were added after unix date
     */
    added$get: {
      relativePath: 'added',
      getQueryParams: (params: { after: number }) => params
    },
    /**
     * Get booking by id
     */
    byId$get: {
      relativePath: ':id',
      withPathVariable: createPathReplacer(':id')
    },
    /**
     * Get bookings that were not paid
     */
    notPaid$get: {
      relativePath: 'not_paid',
      getQueryParams: (params: { arrive_after: number }) => params
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
     * Find bookings that were reminded and already expired (reminded more than 24h ago)
     */
    expiredRemind$get: {
      relativePath: 'expired_remind'
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
    owner: {
      /**
       * Get bookings by owner (customer/guest) id
       */
      byId$get: {
        relativePath: ':id',
        withPathVariable: createPathReplacer(':id')
      }
    },
    /**
     * Find bookings that should arrive already but not marked as living for some reason
     */
    arrivedNotLiving$get: {
      relativePath: 'arrived_not_living'
    }
  },
  clients: {
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
      relativePath: ':id',
      withPathVariable: createPathReplacer(':id')
    }
  },
  notifications: {
    /**
     * Get all notifications
     */
    index$get: {
      relativePath: '/',
      getQueryParams: (params: { id_after: number }) => params
    }
  }
};

enhanceWithUuids(routesV1);

const fullRoutesV1 = mapCompactToFullRoutes(routesV1);

export { routesV1, fullRoutesV1 };
