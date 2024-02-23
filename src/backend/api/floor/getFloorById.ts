import api from '../api';

const getFloorById = async (floor: String) => {
  const res = await api.get(`/floors/${floor}`)
    .catch((err) => {
      console.error(err);
      return null;
    });

  return res?.data;
};

export { getFloorById };
