import api from '../api';

const getNodesByName = async (name: string) => {
  const res = await api.get(`/nodes?name=${name}`)
    .catch((err) => {
      console.error(err);
      return null;
    });

  return res?.data;
};

export { getNodesByName };
