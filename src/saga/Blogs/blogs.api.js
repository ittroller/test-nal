import Axios from '../../services';

const HOME_API = {
  fetch: async params => {
    return await Axios.get(`/blogs`, { params });
  },
  get: async id => {
    return await Axios.get(`/blogs/${id}`);
  },
  post: async data => {
    delete data['id'];
    return await Axios.post(`/blogs`, { ...data });
  },
  put: async payload => {
    const { id, ...data } = payload;
    return await Axios.put(`/blogs/${id}`, { ...data });
  },
  delete: async id => {
    return await Axios.delete(`/blogs/${id}`);
  },
};

export default HOME_API;
