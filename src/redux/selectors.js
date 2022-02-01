const selectors = {
  extractUser: state => state.app.user,
  extractNotification: state => state.app.notification,
  extractLabels: state => state.labels,
  extractEntries: state => state.entries,
};

export default selectors;