import { registerActionHandler } from '~@callbacks/CallbackHandler';
import {
  dashboardDayAfter,
  dashboardDayBefore,
  dashboardNotMarkedLiving,
  dashboardNotPrepaid,
  dashboardRefresh, dashboardToday,
  dashboardUnreadNotifications
} from './actions';
import {
  cbRefreshDashboard,
  cbReplyWithDashboardDayAfter,
  cbReplyWithDashboardDayBefore,
  cbReplyWithNotMarkedLivingBookings,
  cbReplyNotPrepaidMenu,
  cbReplyWithUnreadNotifications,
  cbReplyWithDashboardToday
} from './handlers';

registerActionHandler(dashboardRefresh, cbRefreshDashboard);
registerActionHandler(dashboardDayAfter, cbReplyWithDashboardDayAfter);
registerActionHandler(dashboardDayBefore, cbReplyWithDashboardDayBefore);
registerActionHandler(dashboardToday, cbReplyWithDashboardToday);
registerActionHandler(dashboardUnreadNotifications, cbReplyWithUnreadNotifications);
registerActionHandler(dashboardNotMarkedLiving, cbReplyWithNotMarkedLivingBookings);
registerActionHandler(dashboardNotPrepaid, cbReplyNotPrepaidMenu);
