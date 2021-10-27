import axiosInstance from "../../axios";

const actions = {
  GET_LABELS: "GET_LABELS",
  GET_LABELS_PENDING: "GET_LABELS_PENDING",
  GET_LABELS_FULFILLED: "GET_LABELS_FULFILLED",

  getLabels: () => ({
    type: actions.GET_LABELS,
    payload: axiosInstance.get("/labels")
  })
};

export default actions;
