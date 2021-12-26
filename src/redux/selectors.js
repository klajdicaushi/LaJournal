const selectors = {
  extractLabels: state => state.labels,
  extractEntries: state => state.entries,
  extractNotification: state => state.app.notification
};

export default selectors;