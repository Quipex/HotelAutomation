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
  refreshDashboard,
  replyWithDashboardDayAfter,
  replyWithDashboardDayBefore,
  replyWithNotMarkedLivingBookings,
  replyWithNotPrepaidMenu,
  cbReplyWithUnreadNotifications
} from './handlers';

registerActionHandler(dashboardRefresh, refreshDashboard);
registerActionHandler(dashboardDayAfter, replyWithDashboardDayAfter);
registerActionHandler(dashboardDayBefore, replyWithDashboardDayBefore);
registerActionHandler(dashboardUnreadNotifications, cbReplyWithUnreadNotifications);
registerActionHandler(dashboardNotMarkedLiving, replyWithNotMarkedLivingBookings);
registerActionHandler(dashboardNotPrepaid, replyWithNotPrepaidMenu);
