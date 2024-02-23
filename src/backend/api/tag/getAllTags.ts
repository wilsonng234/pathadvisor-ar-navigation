import api from '../api';

const getAllTags = async () => {
  const res = await api.get(`/tags`)
    .catch((err) => {
      console.error(err);
      return null;
    });

  return res?.data;
};

export { getAllTags };
