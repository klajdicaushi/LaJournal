import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axiosInstance, { disableAxiosToken, updateAxiosToken } from "../../axios";
import appActions from "./actions";

function disableToken() {
  disableAxiosToken();
  localStorage.removeItem("refresh_token");
}

function* login() {
  yield takeEvery(appActions.LOGIN, function* (action) {
    try {
      const {username, password, keepLoggedIn} = action;
      yield put({type: appActions.LOGIN_PENDING});

      const response = yield call(axiosInstance.post, "/token/pair", {username, password});
      const {access, refresh} = response.data;

      yield put(appActions.acquiredRefreshToken(refresh));
      yield put(appActions.loggedIn(access));

      if (keepLoggedIn)
        localStorage.setItem("refresh_token", refresh);
    } catch (error) {
      yield put({type: appActions.LOGIN_FAILED});
      if (error.toJSON().message === "Network Error")
        yield put(appActions.showErrorNotification("Network Error! Please verify your connection and try again."))
      else
        yield put(appActions.showErrorNotification("Incorrect credentials!"))
    }
  })
}

function* loginWithRefreshToken() {
  yield takeEvery(appActions.LOGIN_WITH_REFRESH_TOKEN, function* (action) {
    try {
      yield put({type: appActions.LOGIN_PENDING});

      const response = yield call(axiosInstance.post, "/token/refresh", {refresh: action.refreshToken});
      const {access} = response.data;

      yield put(appActions.loggedIn(access));
    } catch (error) {
      yield put({type: appActions.LOGIN_FAILED});
      if (error.toJSON().message === "Network Error")
        yield put(appActions.showErrorNotification("Network Error! Please verify your connection and try again."))
    }
  })
}

function* loggedIn() {
  yield takeEvery(appActions.LOGGED_IN, function* (action) {
    try {
      updateAxiosToken(action.accessToken);

      const response = yield call(axiosInstance.get, "/me");
      const user = response.data;

      yield put(appActions.showSuccessNotification(`Welcome ${user.username}!`))
      yield put(appActions.loginSuccessful(user));
    } catch (error) {
      yield put({type: appActions.LOGIN_FAILED});
    }
  })
}

function* logOut() {
  yield takeEvery(appActions.LOGOUT, function* (action) {
    if (action.tokenExpired)
      yield put(appActions.showErrorNotification("Your session has expired! Please log in again."))
    else
      yield put(appActions.showSuccessNotification("Goodbye!"));

    disableToken();
  })
}

function* changePassword() {
  yield takeEvery(appActions.CHANGE_PASSWORD, function* (action) {
    try {
      const {newPassword} = action;
      yield call(axiosInstance.put, "/change-password", {new_password: newPassword});

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
    fork(loginWithRefreshToken),
    fork(loggedIn),
    fork(logOut),
    fork(changePassword),
  ]);
}
