import api from '../api';

const getAllTags = async () => {
  const res = await api.get(`/tags`);

  return res.data;
};

export { getAllTags };
