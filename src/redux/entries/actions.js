import axiosInstance from "../../axios";

const actions = {
  GET_ENTRIES: "GET_ENTRIES",
  GET_ENTRIES_PENDING: "GET_ENTRIES_PENDING",
  GET_ENTRIES_FULFILLED: "GET_ENTRIES_FULFILLED",

  getEntries: () => ({
    type: actions.GET_ENTRIES,
    payload: axiosInstance.get("/entries")
  })
};

export default actions;