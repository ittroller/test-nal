/* eslint-disable */
import { takeEvery, put, call } from 'redux-saga/effects';

import * as Types from './blogs.type';
import * as Actions from './blogs.action';
import API from './blogs.api';

function* fetchSaga({ params }) {
  try {
    const response = yield call(API.fetch, params);
    if (response) {
      yield put(Actions.fetchSucces(response));
    }
  } catch (error) {
    yield put(Actions.fetchFailure(error));
  }
}

function* patchSaga({ params }) {
  try {
    let response = null;
    if (params?.id) {
      response = yield call(API.put, params);
      console.log('saga', response);
    } else {
      response = yield call(API.post, params);
      console.log('saga', response);
    }
    console.log('saga', response);
    if (response) {
      yield put(Actions.patchSucces(response));
      return response;
    }
  } catch (error) {
    yield put(
      Actions.patchFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export function* blogsSaga() {
  yield takeEvery(Types.FETCH_REQUEST, fetchSaga);
  yield takeEvery(Types.PATCH_REQUEST, patchSaga);
}
