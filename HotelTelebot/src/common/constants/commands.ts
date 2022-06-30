const COMMAND_CLIENT_FIND_BY_NAME = ['cl', 'c', 'client'];
const COMMAND_BOOKINGS_ARRIVE_ON = 'arrive';
const COMMAND_BOOKINGS_ADDED_AFTER = 'added';
const COMMAND_BOOKING_BY_ID = 'id';
const COMMAND_CLIENT_BY_ID = 'cl_id';
const COMMAND_SYNC = 'sync';
const COMMAND_BOOKING_CREATE = 'create';
const COMMAND_BOOKINGS_NOT_PREPAID = ['not_payed', 'prepay', 'prepayment', 'pp', 'npp'];
const COMMAND_BOOKINGS_PREPAID_EXPIRED = ['pp_expired', 'expired'];
const COMMAND_BOOKING_MOVE = 'mv';
const COMMAND_BOOKING_MOVE_IN_BATCH = 'mv_batch';
const DASHBOARD_LITERAL = 'dashboard';
const COMMAND_DASHBOARD = [DASHBOARD_LITERAL, 'status'];
const COMMAND_UNREAD_NOTIFICATIONS = 'unread';
const COMMAND_SET_CLIENT_NOTE = 'note_cl';
const COMMAND_SET_BOOKING_NOTE = 'note_b';
const COMMAND_ROOM_BY_NUMBER = 'room';
const COMMAND_SET_ROOM_NOTE = 'note_r';

export {
  COMMAND_CLIENT_FIND_BY_NAME,
  COMMAND_BOOKINGS_ARRIVE_ON,
  COMMAND_BOOKINGS_ADDED_AFTER,
  COMMAND_BOOKING_BY_ID,
  COMMAND_CLIENT_BY_ID,
  COMMAND_SYNC,
  COMMAND_BOOKING_CREATE,
  COMMAND_BOOKINGS_NOT_PREPAID,
  COMMAND_BOOKINGS_PREPAID_EXPIRED,
  COMMAND_BOOKING_MOVE,
  COMMAND_BOOKING_MOVE_IN_BATCH,
  COMMAND_DASHBOARD,
  DASHBOARD_LITERAL,
  COMMAND_UNREAD_NOTIFICATIONS,
  COMMAND_SET_BOOKING_NOTE,
  COMMAND_SET_CLIENT_NOTE,
  COMMAND_ROOM_BY_NUMBER,
  COMMAND_SET_ROOM_NOTE
};
