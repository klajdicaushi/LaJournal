import axiosInstance from "../../axios";

const actions = {
  GET_LABELS: "GET_LABELS",
  GET_LABELS_PENDING: "GET_LABELS_PENDING",
  GET_LABELS_FULFILLED: "GET_LABELS_FULFILLED",

  CREATE_NEW_LABEL: "CREATE_NEW_LABEL",
  CREATE_NEW_LABEL_PENDING: "CREATE_NEW_LABEL_PENDING",
  CREATE_NEW_LABEL_FULFILLED: "CREATE_NEW_LABEL_FULFILLED",

  DELETE_LABEL: "DELETE_LABEL",
  DELETE_LABEL_PENDING: "DELETE_LABEL_PENDING",
  DELETE_LABEL_FULFILLED: "DELETE_LABEL_FULFILLED",

  getLabels: () => ({
    type: actions.GET_LABELS,
    payload: axiosInstance.get("/labels")
  }),
  createNewLabel: (labelData) => ({
    type: actions.CREATE_NEW_LABEL,
    payload: axiosInstance.post("/labels", {
      name: labelData.name,
      questions_hint: labelData.questionsHint
    })
  }),
  deleteLabel: (labelId) => ({
    type: actions.DELETE_LABEL,
    labelId
  })
};

export default actions;
