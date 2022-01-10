import axiosInstance from "../../axios";

const actions = {
  GET_ENTRIES: "GET_ENTRIES",
  GET_ENTRIES_PENDING: "GET_ENTRIES_PENDING",
  GET_ENTRIES_FULFILLED: "GET_ENTRIES_FULFILLED",

  CREATE_ENTRY: "CREATE_ENTRY",
  CREATE_ENTRY_PENDING: "CREATE_ENTRY_PENDING",
  CREATE_ENTRY_FULFILLED: "CREATE_ENTRY_FULFILLED",

  EDIT_ENTRY: "EDIT_ENTRY",
  EDIT_ENTRY_PENDING: "EDIT_ENTRY_PENDING",
  EDIT_ENTRY_FULFILLED: "EDIT_ENTRY_FULFILLED",

  DELETE_ENTRY: "DELETE_ENTRY",
  DELETE_ENTRY_PENDING: "DELETE_ENTRY_PENDING",
  DELETE_ENTRY_FULFILLED: "DELETE_ENTRY_FULFILLED",

  ASSIGN_LABEL_TO_PARAGRAPHS: "ASSIGN_LABEL_TO_PARAGRAPHS",
  ASSIGN_LABEL_TO_PARAGRAPHS_PENDING: "ASSIGN_LABEL_TO_PARAGRAPHS_PENDING",
  ASSIGN_LABEL_TO_PARAGRAPHS_FULFILLED: "ASSIGN_LABEL_TO_PARAGRAPHS_FULFILLED",

  REMOVE_LABEL_FROM_PARAGRAPH: "REMOVE_LABEL_FROM_PARAGRAPH",
  REMOVE_LABEL_FROM_PARAGRAPH_PENDING: "REMOVE_LABEL_FROM_PARAGRAPH_PENDING",
  REMOVE_LABEL_FROM_PARAGRAPH_FULFILLED: "REMOVE_LABEL_FROM_PARAGRAPH_FULFILLED",

  getEntries: () => ({
    type: actions.GET_ENTRIES,
    payload: axiosInstance.get("/entries")
  }),

  createEntry: (newEntryData) => ({
    type: actions.CREATE_ENTRY,
    newEntryData
  }),

  editEntry: (entryId, editedEntryData) => ({
    type: actions.EDIT_ENTRY,
    entryId,
    editedEntryData
  }),

  assignLabelToParagraphs: (entryId, paragraphOrders, labelId) => ({
    type: actions.ASSIGN_LABEL_TO_PARAGRAPHS,
    entryId,
    paragraphOrders,
    labelId
  }),

  removeLabelFromParagraph: (entryId, paragraphOrder, labelId) => ({
    type: actions.REMOVE_LABEL_FROM_PARAGRAPH,
    entryId,
    paragraphOrder,
    labelId
  }),

  deleteEntry: (entryId) => ({
    type: actions.DELETE_ENTRY,
    entryId
  }),
};

export default actions;