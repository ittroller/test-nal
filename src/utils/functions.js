import lodash from 'lodash';

export const rangePage = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

export const getQueryString = params => {
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
};
