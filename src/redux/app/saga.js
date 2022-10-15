import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axiosInstance, { apiUrl, disableAxiosToken, updateAxiosToken } from "../../axios";
import appActions from "./actions";
import axios from "axios";

function disableToken() {
  disableAxiosToken();
  localStorage.removeItem("token");
}

function* login() {
  yield takeEvery(appActions.LOGIN, function* (action) {
    try {
      const {username, password, keepLoggedIn} = action;
      yield put({type: appActions.LOGIN_PENDING});

      const response = yield call(axios.post, `${apiUrl}/login`, {username, password});
      const {user, token} = response.data;

      updateAxiosToken(token);
      yield put(appActions.showSuccessNotification(`Welcome ${user.username}!`))
      yield put(appActions.loginSuccessful(user, token));

      if (keepLoggedIn)
        localStorage.setItem("token", token);
    } catch (error) {
      yield put({type: appActions.LOGIN_FAILED});
      if (error.toJSON().message === "Network Error")
        yield put(appActions.showErrorNotification("Network Error! Please verify your connection and try again."))
      else
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

function* verifyToken() {
  yield takeEvery(appActions.VERIFY_TOKEN, function* (action) {
    try {
      const {token} = action;
      yield put({type: appActions.LOGIN_PENDING});
      const headers = {'Authorization': 'Bearer ' + token};
      const response = yield call(axiosInstance.post, `/validate-token`, {}, {headers});
      updateAxiosToken(token);

      yield put(appActions.loginSuccessful(response.data, token))
    } catch (e) {
      yield put({type: appActions.LOGIN_FAILED});
    }
  })
}

export default function* () {
  yield all([
    fork(login),
    fork(logOut),
    fork(changePassword),
    fork(verifyToken),
  ]);
}
