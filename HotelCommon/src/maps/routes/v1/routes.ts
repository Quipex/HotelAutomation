import { enhanceWithUuids, mapCompactToFullRoutes } from '../helpers';
import { bookings, clients, dashboard, notifications, root, rooms } from './paths';

const routesV1 = {
  '/': root,
  dashboard,
  bookings,
  clients,
  notifications,
  rooms
};

enhanceWithUuids(routesV1);

const fullRoutesV1 = mapCompactToFullRoutes(routesV1);

export { routesV1, fullRoutesV1 };
