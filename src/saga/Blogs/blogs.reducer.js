import * as Types from './blogs.type';

const initialState = {
  blogs: [],
  blog: null,
  totalPages: 0,
  loading: false,
  error: null,
};

const blogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_REQUEST: {
      return { ...state, loading: true };
    }
    case Types.FETCH_SUCCESS: {
      return {
        ...state,
        blogs: action?.payload || [],
        totalPages: action?.payload?.length ? Math.ceil(action?.payload?.length / 10) : 0,
        loading: false,
      };
    }
    case Types.FETCH_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }

    case Types.PATCH_REQUEST: {
      return { ...state, loading: true };
    }
    case Types.PATCH_SUCCESS: {
      return { ...state, loading: false };
    }
    case Types.PATCH_FAILURE: {
      console.log(action);
      return { ...state, loading: false, error: action.error };
    }

    default:
      return state;
  }
};

export default blogsReducer;
