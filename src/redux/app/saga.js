import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { apiUrl, disableAxiosToken, updateAxiosToken } from "../../axios";
import appActions from "../app/actions";
import axios from "axios";

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
  yield takeEvery(appActions.LOGOUT, function* () {
    localStorage.removeItem("token");
    disableAxiosToken();
    yield(put(appActions.showSuccessNotification("Goodbye!")))
  })
}

export default function* () {
  yield all([
    fork(login),
    fork(logOut),
  ]);
}
