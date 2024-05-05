import api from '../api';

const getAllFloors = async () => {
  const res = await api.get(`/floors`)
    .catch((err) => {
      console.error(err);
      return null;
    });

  return res?.data;
};

export { getAllFloors };
