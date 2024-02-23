import api from '../api';

const getAllBuildings = async () => {
  const res = await api.get(`/buildings`)
    .catch((err) => {
      console.error(err);
      return null;
    })

  return res?.data;
};

export { getAllBuildings };
