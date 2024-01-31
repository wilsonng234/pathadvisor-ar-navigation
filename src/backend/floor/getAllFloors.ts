import api from '../api';

const getAllFloors = async () => {
  const res = await api.get(`/floors`);

  return res.data;
};

export default getAllFloors;
