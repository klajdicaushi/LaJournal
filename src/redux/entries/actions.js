import axiosInstance from "../../axios";

const actions = {
  GET_ENTRIES: "GET_ENTRIES",
  GET_ENTRIES_PENDING: "GET_ENTRIES_PENDING",
  GET_ENTRIES_FULFILLED: "GET_ENTRIES_FULFILLED",

  CREATE_ENTRY: "CREATE_ENTRY",
  CREATE_ENTRY_PENDING: "CREATE_ENTRY_PENDING",
  CREATE_ENTRY_FULFILLED: "CREATE_ENTRY_FULFILLED",

  getEntries: () => ({
    type: actions.GET_ENTRIES,
    payload: axiosInstance.get("/entries")
  }),

  createEntry: (newEntryData) => ({
    type: actions.CREATE_ENTRY,
    newEntryData
  })
};

export default actions;