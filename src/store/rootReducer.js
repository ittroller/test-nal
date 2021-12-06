import { combineReducers } from 'redux';

import blogsReducer from '../saga/Blogs/blogs.reducer';

const rootReducer = () =>
  combineReducers({
    blogs: blogsReducer,
  });

export default rootReducer;
