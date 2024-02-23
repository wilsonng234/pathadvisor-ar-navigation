import api from '../api';

const getWalkingPathWithinBoundingBox = async (
  floorId: string,
  boxCoordinates: string,
) => {
  const res = await api.get(
    `/floors/${floorId}/nodes?boxCoordinates=${boxCoordinates}`,
  ).catch((err) => {
    console.error(err);
    return null;
  });

  return res?.data;
};


export { getWalkingPathWithinBoundingBox };
