import { BookingCreationPayload } from '~/types/routes/routes.v1.types';
import { createPathReplacer } from './helpers/createPathReplacer';
import { enhanceWithUuids } from './helpers/enhanceWithUuids';
import { mapCompactToFullRoutes } from './helpers/mapCompactToFullRoutes';

const routesV1 = {
  '/': {
    index$get: {
      relativePath: '/'
    }
  },
  bookings: {
    index$post: {
      relativePath: '/'
    },
    cached$get: {
      relativePath: 'cached'
    },
    arrive$get: {
      relativePath: 'arrive',
      getQueryParams: (params: { date: number }) => params
    },
    added$get: {
      relativePath: 'added',
      getQueryParams: (params: { after: number }) => params
    },
    byId$get: {
      relativePath: ':id',
      withPathVariable: createPathReplacer(':id')
    },
    notPayed$get: {
      relativePath: 'not_payed',
      getQueryParams: (params: { arrive_after: number }) => params
    },
    sync$put: {
      relativePath: 'sync'
    },
    confirm$put: {
      relativePath: 'confirm',
      getData: (data: { bookingId: string }) => data
    },
    confirmLiving$put: {
      relativePath: 'confirm_living',
      getData: (data: { bookingId: string }) => data
    },
    remindedPrepayment$put: {
      relativePath: 'reminded_prepayment',
      getData: (data: { bookingId: string }) => data
    },
    expiredRemind$get: {
      relativePath: 'expired_remind'
    },
    create$put: {
      relativePath: 'create',
      getData: (data: BookingCreationPayload) => data
    },
    owner: {
      byId$get: {
        relativePath: ':id',
        withPathVariable: createPathReplacer(':id')
      }
    }
  },
  clients: {
    sync$put: {
      relativePath: 'sync'
    },
    search$post: {
      relativePath: 'search',
      getData: (data: { name: string }) => data
    },
    byId$get: {
      relativePath: ':id',
      withPathVariable: createPathReplacer(':id')
    }
  }
};

enhanceWithUuids(routesV1);

const fullRoutesV1 = mapCompactToFullRoutes(routesV1);

export { routesV1, fullRoutesV1 };
