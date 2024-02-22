import api from '../api';

const getFloorById = async (floor: String) => {
  const res = await api.get(`/floors/${floor}`);

  return res.data;
};

export { getFloorById };
