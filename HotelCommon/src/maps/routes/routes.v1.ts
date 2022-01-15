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
      relativePath: 'arrive'
    },
    added$get: {
      relativePath: 'added'
    },
    byId$get: {
      relativePath: ':id'
    },
    notPayed$get: {
      relativePath: 'not_payed'
    },
    sync$put: {
      relativePath: 'sync'
    },
    confirm$put: {
      relativePath: 'confirm'
    },
    confirmLiving$put: {
      relativePath: 'confirm_living'
    },
    remindedPrepayment$put: {
      relativePath: 'reminded_prepayment'
    },
    expiredRemind$get: {
      relativePath: 'expired_remind'
    },
    create$put: {
      relativePath: 'create'
    },
    owner: {
      byId$get: {
        relativePath: ':id'
      }
    }
  },
  clients: {
    sync$put: {
      relativePath: 'sync'
    },
    search$post: {
      relativePath: 'search'
    },
    byId$get: {
      relativePath: ':id'
    }
  }
};

enhanceWithUuids(routesV1);

const fullRoutesV1 = mapCompactToFullRoutes(routesV1);

export { routesV1, fullRoutesV1 };
