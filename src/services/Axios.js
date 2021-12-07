import axios from 'axios';

export class AxiosClient {
  instance;

  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
      headers: {
        Authorization: this.getToken(),
      },
    });

    this._initializeResponseInterceptor();
  }

  getToken() {
    return `Bearer ${this.token}`;
  }

  setToken(token) {
    this.token = token;
  }

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.request.use(this._handleRequestSuccess, this._handleRequestError);
    this.instance.interceptors.response.use(this._handleResponseSuccess, this._handleResponseError);
  };

  _handleRequestSuccess = config => config;

  _handleRequestError = error => {
    if (error.response) {
      return error.response.data;
    }

    return Promise.reject(error);
  };

  _handleResponseSuccess = ({ data }) => {
    /* HANDLE SUCCESS WARNING HERE */
    return data;
  };

  _handleResponseError = async error => {
    /* HANDLE ERROR RESPONSE HERE */

    // const { data } = error.response;
    // return await error?.response?.data;
    return Promise.reject(error);
  };

  get(url, config) {
    return this.instance.get(url, config);
  }

  delete(url, config) {
    return this.instance.delete(url, config);
  }

  post(url, data, config) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config) {
    return this.instance.put(url, data, config);
  }

  patch(url, data, config) {
    return this.instance.patch(url, data, config);
  }
}
