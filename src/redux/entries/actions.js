import axiosInstance from "../../axios";

const actions = {
  GET_ENTRIES: "GET_ENTRIES",
  GET_ENTRIES_PENDING: "GET_ENTRIES_PENDING",
  GET_ENTRIES_FULFILLED: "GET_ENTRIES_FULFILLED",

  GET_ENTRY: "GET_ENTRY",
  GET_ENTRY_PENDING: "GET_ENTRY_PENDING",
  GET_ENTRY_FULFILLED: "GET_ENTRY_FULFILLED",

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

  SET_SELECTED_LABEL_IDS: "SET_SELECTED_LABEL_IDS",
  FILTER_ENTRIES_FULFILLED: "FILTER_ENTRIES_FULFILLED",

  TOGGLE_ENTRY_BOOKMARK: "TOGGLE_ENTRY_BOOKMARK",
  TOGGLE_ENTRY_BOOKMARK_PENDING: "TOGGLE_ENTRY_BOOKMARK_PENDING",
  TOGGLE_ENTRY_BOOKMARK_FULFILLED: "TOGGLE_ENTRY_BOOKMARK_FULFILLED",

  getEntries: () => ({
    type: actions.GET_ENTRIES,
    payload: axiosInstance.get("/entries")
  }),

  getEntry: (entryId) => ({
    type: actions.GET_ENTRY,
    payload: axiosInstance.get(`/entries/${entryId}`)
  }),

  createEntry: (newEntryData, navigate) => ({
    type: actions.CREATE_ENTRY,
    newEntryData,
    navigate
  }),

  editEntry: (entryId, editedEntryData, navigate) => ({
    type: actions.EDIT_ENTRY,
    entryId,
    editedEntryData,
    navigate
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

  deleteEntry: (entryId, navigate) => ({
    type: actions.DELETE_ENTRY,
    entryId,
    navigate
  }),

  setSelectedLabelIds: (selectedLabelIds) => ({
    type: actions.SET_SELECTED_LABEL_IDS,
    selectedLabelIds
  }),

  toggleEntryBookmark: (entryId) => ({
    type: actions.TOGGLE_ENTRY_BOOKMARK,
    entryId
  })
};

export default actions;