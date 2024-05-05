import api from '../api';

const getNodeByNearCoordinates = async (
  floorId: string,
  nearCoordinates: string,
) => {
  const res = await api.get(
    `/floors/${floorId}/node?nearCoordinates=${nearCoordinates}`,
  ).catch((err) => {
    console.error(err);
    return null;
  });

  return res?.data;
};


export { getNodeByNearCoordinates };
