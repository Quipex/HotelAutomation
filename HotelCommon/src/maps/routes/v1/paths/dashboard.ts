export default {
  /**
   * Get daily status
   */
  index$get: {
    relativePath: '/',
    getQueryParams: (params: { date: string }) => params
  }
};
