import actions from "./actions";

const defaultNotification = {
  open: false,
  message: "",
  severity: "success"
};

const initialState = {
  user: null,
  loggingInOrOut: false,
  refreshToken: null,
  notification: defaultNotification
};

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_PENDING:
    case actions.LOGOUT_PENDING:
      return {
        ...state,
        loggingInOrOut: true
      }
    case actions.LOGIN_FAILED:
      return {
        ...state,
        refreshToken: null,
        loggingInOrOut: false
      }
    case actions.LOGGED_IN:
      return {
        ...state,
        refreshToken: action.refreshToken
      }
    case actions.LOGIN_SUCCESSFUL:
      return {
        ...state,
        loggingInOrOut: false,
        user: action.user
      }
    case actions.LOGOUT_SUCCESSFUL:
      return {
        ...state,
        loggingInOrOut: false,
        user: null,
        refreshToken: null
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