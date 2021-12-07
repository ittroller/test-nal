import { combineReducers } from 'redux';

import blogsReducer from '../saga/Blogs/blogs.reducer';

const rootReducer = () =>
  combineReducers({
    blogsReducer,
  });

export default rootReducer;
