import actions from "./actions";

const defaultNotification = {
  open: false,
  message: "",
  severity: "success"
};

const initialState = {
  user: null,
  notification: defaultNotification
};

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESSFUL:
      return {
        ...state,
        user: action.user
      }
    case actions.LOGOUT:
      return {
        ...state,
        user: null
      }
    case actions.SHOW_SUCCESS_NOTIFICATION:
      return {
        ...state,
        notification: {
          open: true,
          message: action.message,
          severity: "success"
        }
      };
    case actions.SHOW_ERROR_NOTIFICATION:
      return {
        ...state,
        notification: {
          open: true,
          message: action.message,
          severity: "error"
        }
      };
    case actions.CLOSE_NOTIFICATION:
      return {
        ...state,
        notification: {...defaultNotification, severity: state.notification.severity}
      }
    default:
      return state;
  }
}