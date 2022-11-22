const selectors = {
  extractUser: state => state.app.user,
  extractLoggingInOrOut: state => state.app.loggingInOrOut,
  extractRefreshToken: state => state.app.refreshToken,
  extractNotification: state => state.app.notification,
  extractLabels: state => state.labels,
  extractEntries: state => state.entries,
};

export default selectors;