const actions = {
  SHOW_SUCCESS_NOTIFICATION: "SHOW_SUCCESS_NOTIFICATION",
  SHOW_ERROR_NOTIFICATION: "SHOW_ERROR_NOTIFICATION",
  CLOSE_NOTIFICATION: "CLOSE_NOTIFICATION",
  LOGIN: "LOGIN",
  LOGIN_SUCCESSFUL: "LOGIN_SUCCESSFUL",

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
  login: (username, password) => ({
    type: actions.LOGIN,
    username,
    password
  }),
  loginSuccessful: (user, token) => ({
    type: actions.LOGIN_SUCCESSFUL,
    user,
    token
  })
};

export default actions;