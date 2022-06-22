import { registerActionHandler } from '~@callbacks/CallbackHandler';
import {
  dashboardDayAfter,
  dashboardDayBefore,
  dashboardNotMarkedLiving,
  dashboardNotPrepaid,
  dashboardRefresh,
  dashboardUnreadNotifications
} from './actions';
import {
  cbRefreshDashboard,
  cbReplyWithDashboardDayAfter,
  cbReplyWithDashboardDayBefore,
  cbReplyWithNotMarkedLivingBookings,
  cbReplyNotPrepaidMenu,
  cbReplyWithUnreadNotifications
} from './handlers';

registerActionHandler(dashboardRefresh, cbRefreshDashboard);
registerActionHandler(dashboardDayAfter, cbReplyWithDashboardDayAfter);
registerActionHandler(dashboardDayBefore, cbReplyWithDashboardDayBefore);
registerActionHandler(dashboardUnreadNotifications, cbReplyWithUnreadNotifications);
registerActionHandler(dashboardNotMarkedLiving, cbReplyWithNotMarkedLivingBookings);
registerActionHandler(dashboardNotPrepaid, cbReplyNotPrepaidMenu);
