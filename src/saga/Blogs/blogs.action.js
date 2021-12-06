import * as Types from './blogs.type';

export const fetchRequest = params => ({ type: Types.FETCH_REQUEST, params });
export const fetchSucces = payload => ({ type: Types.FETCH_SUCCESS, payload });
export const fetchFailure = error => ({ type: Types.FETCH_FAILURE, error });

export const patchRequest = params => ({ type: Types.PATCH_REQUEST, params });
export const patchSucces = payload => ({ type: Types.PATCH_SUCCESS, payload });
export const patchFailure = error => ({ type: Types.PATCH_FAILURE, error });
