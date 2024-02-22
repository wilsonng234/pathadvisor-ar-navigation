import api from '../api';

const getConnectorById = async (connectorId: string) => {
  const res = await api.get(`/connectors/${connectorId}`);

  return res.data;
};

export { getConnectorById };
