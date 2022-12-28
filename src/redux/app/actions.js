const actions = {
  SHOW_SUCCESS_NOTIFICATION: "SHOW_SUCCESS_NOTIFICATION",
  SHOW_ERROR_NOTIFICATION: "SHOW_ERROR_NOTIFICATION",
  CLOSE_NOTIFICATION: "CLOSE_NOTIFICATION",

  LOGIN: "LOGIN",
  LOGIN_WITH_REFRESH_TOKEN: "LOGIN_WITH_REFRESH_TOKEN",
  LOGIN_PENDING: "LOGIN_PENDING",
  LOGGED_IN: "LOGGED_IN",
  LOGIN_SUCCESSFUL: "LOGIN_SUCCESSFUL",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  LOGOUT_PENDING: "LOGOUT_PENDING",
  LOGOUT_SUCCESSFUL: "LOGOUT_SUCCESSFUL",

  CHANGE_PASSWORD: "CHANGE_PASSWORD",

  showSuccessNotification: (message) => ({
    type: actions.SHOW_SUCCESS_NOTIFICATION,
    message
  }),
  showErrorNotification: (message = "An error happened!") => ({
    type: actions.SHOW_ERROR_NOTIFICATION,
    message
  }),
  closeNotification: () => ({
    type: actions.CLOSE_NOTIFICATION
  }),
  login: (username, password, keepLoggedIn) => ({
    type: actions.LOGIN,
    username,
    password,
    keepLoggedIn
  }),
  loginWithRefreshToken: (refreshToken) => ({
    type: actions.LOGIN_WITH_REFRESH_TOKEN,
    refreshToken
  }),
  loggedIn: (accessToken, refreshToken) => ({
    type: actions.LOGGED_IN,
    accessToken,
    refreshToken
  }),
  loginSuccessful: (user) => ({
    type: actions.LOGIN_SUCCESSFUL,
    user,
  }),
  logOut: (invalidateRefreshToken = false) => ({
    type: actions.LOGOUT,
    invalidateRefreshToken
  }),
  changePassword: (newPassword) => ({
    type: actions.CHANGE_PASSWORD,
    newPassword
  }),
};

export default actions;