const actions = {
  SHOW_SUCCESS_NOTIFICATION: "SHOW_SUCCESS_NOTIFICATION",
  SHOW_ERROR_NOTIFICATION: "SHOW_ERROR_NOTIFICATION",
  CLOSE_NOTIFICATION: "CLOSE_NOTIFICATION",

  LOGIN: "LOGIN",
  LOGIN_SUCCESSFUL: "LOGIN_SUCCESSFUL",
  LOGOUT: "LOGOUT",

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
  loginSuccessful: (user, token) => ({
    type: actions.LOGIN_SUCCESSFUL,
    user,
    token
  }),
  logOut: (showGoodbyeMessage = true) => ({
    type: actions.LOGOUT,
    showGoodbyeMessage
  }),
  changePassword: (newPassword) => ({
    type: actions.CHANGE_PASSWORD,
    newPassword
  })
};

export default actions;