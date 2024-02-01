import api from '../api';

const getFloor = async (floor:String) => {
  const res = await api.get(`/floors/${floor}`);

  return res.data;
};

export {getFloor};
