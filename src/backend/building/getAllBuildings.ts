import api from '../api';

const getAllBuildings = async () => {
  const res = await api.get(`/buildings`);

  return res.data;
};

export {getAllBuildings};
