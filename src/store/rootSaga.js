import { all } from 'redux-saga/effects';

import { blogsSaga } from '../saga/Blogs/blogs.saga';

export default function* rootSaga() {
  yield all([blogsSaga()]);
}
