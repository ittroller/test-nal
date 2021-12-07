import * as Types from './blogs.type';

export const fetchRequest = params => ({ type: Types.FETCH_REQUEST, params });
export const fetchSuccess = payload => ({ type: Types.FETCH_SUCCESS, payload });
export const fetchFailure = error => ({ type: Types.FETCH_FAILURE, error });

export const patchRequest = (params, callback) => ({ type: Types.PATCH_REQUEST, params, callback });
export const patchSuccess = payload => ({ type: Types.PATCH_SUCCESS, payload });
export const patchFailure = error => ({ type: Types.PATCH_FAILURE, error });

export const getRequest = params => ({ type: Types.GET_REQUEST, params });
export const getSuccess = payload => ({ type: Types.GET_SUCCESS, payload });
export const getFailure = error => ({ type: Types.GET_FAILURE, error });

export const deleteRequest = params => ({ type: Types.DELETE_REQUEST, params });
export const deleteSuccess = payload => ({ type: Types.DELETE_SUCCESS, payload });
export const deleteFailure = error => ({ type: Types.DELETE_FAILURE, error });
