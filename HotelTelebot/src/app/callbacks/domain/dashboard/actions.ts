import { composeCallbackData } from '~@callbacks/helpers';

const prefix = (text) => `d${text}`;

const dashboardRefresh = prefix('Rf');

const cbPayloadRefreshDashboard = (date: string) => {
  return composeCallbackData(dashboardRefresh, date);
};

const dashboardDayBefore = prefix('DB');
const cbPayloadDayBefore = (date: string) => {
  return composeCallbackData(dashboardDayBefore, date);
};

const dashboardDayAfter = prefix('DA');
const cbPayloadDayAfter = (date: string) => {
  return composeCallbackData(dashboardDayAfter, date);
};

const dashboardToday = prefix('DT');

const dashboardUnreadNotifications = prefix('UN');

const dashboardNotPrepaid = prefix('NPp');

const dashboardNotMarkedLiving = prefix('NML');
const cbPayloadNotMarkedLiving = (date: string) => {
  return composeCallbackData(dashboardNotMarkedLiving, date);
};

export {
  dashboardRefresh,
  dashboardDayAfter,
  dashboardToday,
  dashboardDayBefore,
  dashboardNotPrepaid,
  dashboardUnreadNotifications,
  dashboardNotMarkedLiving,
  cbPayloadDayAfter,
  cbPayloadDayBefore,
  cbPayloadRefreshDashboard,
  cbPayloadNotMarkedLiving
};
