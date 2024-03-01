import api from '../api';

const getNodeById = async (id: string) => {
  const res = await api.get(`/nodes/${id}`)
    .catch((err) => {
      console.error(err);
      return null;
    });

  return res?.data;
};


export { getNodeById };
