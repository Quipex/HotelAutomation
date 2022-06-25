export default {
  /**
   * Get all notifications
   */
  index$get: {
    relativePath: '/',
    getQueryParams: (params: { id_after: number }) => params
  },
  /**
   * Get unread notifications
   */
  unread$get: {
    relativePath: 'unread'
  },
  /**
   * Mark notification as read
   */
  read$patch: {
    relativePath: 'read',
    getData: (data: { notificationId: number }) => data
  }
};
