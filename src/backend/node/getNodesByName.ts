import api from '../api';

const getNodesByName = async (name: string) => {
  const res = await api.get(`/nodes?name=${name}`);

  return res.data;
};

export default getNodesByName;
