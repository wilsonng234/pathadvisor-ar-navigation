import api from '../api';

const getNodeById = async (id: string) => {
  const res = await api.get(`/nodes/${id}`);

  return res.data;
};

export default getNodeById;
