import lodash from 'lodash';

let _requests = 0;
let _interceptors = {};

function triggerInterceptors(event, data = {}) {
  lodash.forEach(_interceptors, interceptor => {
    interceptor(event, data);
  });
}

let refreshingTokenPromise = null;

class Request {
  static create(options) {
    return new Request(options);
  }

  static registerInterceptor(name, interceptor) {
    _interceptors[name] = interceptor;
  }

  static unregisterInterceptor(name) {
    _interceptors = lodash.omit(_interceptors, name);
  }

  constructor(options) {
    this._options = options;
  }

  get(url, params) {
    return this.request({ method: 'GET', url, params });
  }

  post(url, data, params) {
    return this.request({ method: 'POST', url, params, data });
  }

  put(url, data, params) {
    return this.request({ method: 'PUT', url, params, data });
  }

  delete(url, data, params) {
    return this.request({
      method: 'DELETE',
      url,
      params: { ...data, ...params },
    });
  }

  async request(...args) {
    _requests += 1;

    triggerInterceptors('request:start', { requests: _requests });

    try {
      return await this._request(...args);
    } finally {
      triggerInterceptors('request:done', { requests: _requests });

      _requests -= 1;
    }
  }

  async _request(requestOptions) {
    const { method = 'GET', data = null } = requestOptions;
    let { url, params = null } = requestOptions;

    url = this._options.endpoint + url;

    if (params) {
      url += this._getQueryString(params);
    }

    const options = {
      method,
      headers: {
        Accept: 'application/json',
      },
    };

    const currentToken = localStorage.getItem('token') || null;

    if (currentToken) options.headers['Authorization'] = `Bearer ${currentToken}`;

    if (method === 'POST' || method === 'PUT') {
      if (data) {
        const serializable = lodash.isPlainObject(data);

        options.body = serializable ? JSON.stringify(data) : data;

        let contentType = null;

        if (serializable) contentType = 'application/json';

        if (contentType) options.headers['Content-Type'] = contentType;
      }
    }

    const res = await fetch(url, options);
    const currentRefreshToken = localStorage.getItem('refresh_token');
    if (res && !res.ok) {
      if (!refreshingTokenPromise && res.status === 401) {
        // Refresh token
        if (res.status === 401) {
          refreshingTokenPromise = new Promise((resolve, reject) => {
            fetch(`${this._options.endpoint}/api/user/refresh-token`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentRefreshToken}`,
              },
              body: JSON.stringify({
                clientId: 1,
                refreshToken: currentRefreshToken,
              }),
            })
              .then(response => response.json())
              .then(json => {
                localStorage.setItem('token', json.data.token);
                localStorage.setItem('refresh_token', json.data.refresh_token);

                refreshingTokenPromise = null;
                resolve(json);
              })
              .catch(error => {
                refreshingTokenPromise = null;
                reject(error);
              });
          });
          // eslint-disable-next-line no-dupe-else-if
        } else if (res.status === 401 && !res.headers.get('token-expired')) {
          localStorage.clear();
          window.location.reload();
          return new Promise((resolve, reject) => {
            reject(res);
          });
        }

        return refreshingTokenPromise
          .catch(error => {
            // If refreshing fails, continue with original error
            return Promise.reject(error);
          })
          .then(res => {
            options.headers['Authorization'] = `Bearer ${res.data.token}`;
            return fetch(url, options)
              .then(response => response.json())
              .then(json => json);
          });
      } else if (!!refreshingTokenPromise && res.status === 401) {
        return refreshingTokenPromise
          .catch(() => {
            // If refreshing fails, continue with original error
            return fetch(url, options)
              .then(response => response.json())
              .then(json => json);
          })
          .then(res => {
            options.headers['Authorization'] = `Bearer ${res.data.token}`;
            return fetch(url, options)
              .then(response => response.json())
              .then(json => json);
          });
      } else {
        triggerInterceptors('response:error', { response: res });
        throw res;
      }
    }

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (error) {
      triggerInterceptors('response:error.json', { error, response: res });
      throw error;
    }
  }

  _getQueryString(params) {
    const parts = [];

    lodash.forEach(params, (value, key) => {
      const values = lodash.isArray(value) ? value : [value];
      const operator = lodash.isArray(value) ? '=' : '=';

      lodash.forEach(values, v => {
        parts.push(key + operator + encodeURIComponent(v));
      });
    });

    const queryString = parts.join('&');

    return queryString ? `?${queryString}` : '';
  }
}

const Service = Request.create({
  endpoint: `${process.env.REACT_APP_URL_API}`,
  handleToken: false,
});

export default Service;
