import axiosInstance from "../../axios";

const actions = {
  GET_LABELS: "GET_LABELS",
  GET_LABELS_PENDING: "GET_LABELS_PENDING",
  GET_LABELS_FULFILLED: "GET_LABELS_FULFILLED",

  CREATE_NEW_LABEL: "CREATE_NEW_LABEL",
  CREATE_NEW_LABEL_PENDING: "CREATE_NEW_LABEL_PENDING",
  CREATE_NEW_LABEL_FULFILLED: "CREATE_NEW_LABEL_FULFILLED",

  EDIT_LABEL: "EDIT_LABEL",
  EDIT_LABEL_PENDING: "EDIT_LABEL_PENDING",
  EDIT_LABEL_FULFILLED: "EDIT_LABEL_FULFILLED",

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
  editLabel: (labelData) => ({
    type: actions.EDIT_LABEL,
    payload: axiosInstance.put(`/labels/${labelData.id}`, {
      name: labelData.name,
      questions_hint: labelData.questions_hint
    })
  }),
  deleteLabel: (labelId) => ({
    type: actions.DELETE_LABEL,
    labelId
  })
};

export default actions;
