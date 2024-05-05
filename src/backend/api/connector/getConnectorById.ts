import api from '../api';

const getConnectorById = async (connectorId: string) => {
  const res = await api.get(`/connectors/${connectorId}`)
    .catch((err) => {
      console.error(err);
      return null;
    });

  return res?.data;
};

export { getConnectorById };
