import actions from "./actions";

const defaultNotification = {
  open: false,
  message: "",
  severity: "success"
};

const initialState = {
  user: null,
  loggingIn: false,
  notification: defaultNotification
};

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_PENDING:
      return {
        ...state,
        loggingIn: true
      }
    case actions.LOGIN_FAILED:
      return {
        ...state,
        loggingIn: false
      }
    case actions.LOGIN_SUCCESSFUL:
      return {
        ...state,
        loggingIn: false,
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
        notification: {...state.notification, open: false}
      }
    default:
      return state;
  }
}