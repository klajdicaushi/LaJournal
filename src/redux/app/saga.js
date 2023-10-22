import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import axiosInstance, { apiUrl, disableAxiosToken, updateAxiosToken } from "../../axios";
import appActions from "./actions";
import selectors from "../selectors";
import axios from "axios";

function disableToken() {
  disableAxiosToken();
  localStorage.removeItem("refresh_token");
}

function* login() {
  yield takeEvery(appActions.LOGIN, function* (action) {
    try {
      const {username, password, keepLoggedIn} = action;
      yield put({type: appActions.LOGIN_PENDING});

      // Using axios instead of axiosInstance to skip interceptor
      const response = yield call(axios.post, `${apiUrl}/token/pair`, {username, password});
      const {access, refresh} = response.data;

      yield put(appActions.loggedIn(access, refresh));

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
      const {refreshToken} = action;

      yield put({type: appActions.LOGIN_PENDING});
      const response = yield call(axiosInstance.post, "/token/refresh-tokens", {refresh_token: refreshToken});
      const {access, refresh} = response.data;

      yield put(appActions.loggedIn(access, refresh));
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
    yield put({type: appActions.LOGOUT_PENDING});

    if (action.invalidateRefreshToken) {
      const refreshToken = yield select(selectors.extractRefreshToken);

      try {
        yield call(axiosInstance.post, "/token/invalidate", {refresh_token: refreshToken});
        yield put(appActions.showSuccessNotification("Goodbye!"));
      } catch (e) {
        console.log("Error while invalidating token!")
      }
    }

    disableToken();
    yield put({type: appActions.LOGOUT_SUCCESSFUL});
  })
}

function* changePassword() {
  yield takeEvery(appActions.CHANGE_PASSWORD, function* (action) {
    try {
      const {currentPassword, newPassword} = action;
      yield call(axiosInstance.put, "/change-password", {
        current_password: currentPassword,
        new_password: newPassword
      });

      yield put(appActions.showSuccessNotification("Password changed successfully!"))
      yield put(appActions.logOut(false));
    } catch (e) {
      const detail = e?.response?.data?.detail;
      if (detail)
        yield put(appActions.showErrorNotification(detail))
      else
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
