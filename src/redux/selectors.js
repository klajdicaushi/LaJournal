const selectors = {
  extractUser: state => state.app.user,
  extractLoggingIn: state => state.app.loggingIn,
  extractNotification: state => state.app.notification,
  extractLabels: state => state.labels,
  extractEntries: state => state.entries,
};

export default selectors;