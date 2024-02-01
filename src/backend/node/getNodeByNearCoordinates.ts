import api from '../api';

const getNodeByNearCoordinates = async (
  floorId: string,
  nearCoordinates: string,
) => {
  const res = await api.get(
    `/floors/${floorId}/node?nearCoordinates=${nearCoordinates}`,
  );

  return res.data;
};


export {getNodeByNearCoordinates};
