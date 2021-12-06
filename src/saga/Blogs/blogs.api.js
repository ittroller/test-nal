import Axios from '../../services';

const HOME_API = {
  fetch: async params => {
    return await Axios.get(`/blogs`, { ...params });
  },
  post: async params => {
    delete params['id'];
    return await Axios.post(`/blogs`, { ...params });
  },
  put: async payload => {
    const { id, ...params } = payload;
    return await Axios.put(`/blogs/${id}`, { ...params });
  },
};

export default HOME_API;
