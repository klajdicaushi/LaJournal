import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axiosInstance, { apiUrl, disableAxiosToken, updateAxiosToken } from "../../axios";
import appActions from "../app/actions";
import axios from "axios";

function disableToken() {
  disableAxiosToken();
  localStorage.removeItem("token");
}

function* login() {
  yield takeEvery(appActions.LOGIN, function* (action) {
    try {
      const {username, password} = action;
      const response = yield call(axios.post, `${apiUrl}/login`, {username, password});
      const {user, token} = response.data;

      updateAxiosToken(token);
      yield put(appActions.showSuccessNotification(`Welcome ${user.username}!`))
      yield put(appActions.loginSuccessful(user, token));

      localStorage.setItem("token", token);
    } catch (e) {
      console.log(typeof e)
      console.log("ERROR HAPPENED", e);
      yield put(appActions.showErrorNotification("Incorrect credentials!"))
    }
  })
}

function* logOut() {
  yield takeEvery(appActions.LOGOUT, function* (action) {
    if (action.showGoodbyeMessage)
      yield(put(appActions.showSuccessNotification("Goodbye!")));
    disableToken();
  })
}

function* changePassword() {
  yield takeEvery(appActions.CHANGE_PASSWORD, function* (action) {
    try {
      const {newPassword} = action;
      yield call(axiosInstance.put, `${apiUrl}/change-password`, {new_password: newPassword});

      yield put(appActions.showSuccessNotification("Password changed successfully!"))
      yield put(appActions.logOut(false));
      disableToken();
    } catch (e) {
      yield put(appActions.showErrorNotification("An error happened. Please try again!"))
    }
  })
}

export default function* () {
  yield all([
    fork(login),
    fork(logOut),
    fork(changePassword),
  ]);
}
