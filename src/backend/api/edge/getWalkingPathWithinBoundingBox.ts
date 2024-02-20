import api from '../api';

const getWalkingPathWithinBoundingBox = async (
  floorId: string,
  boxCoordinates: string,
) => {
  const res = await api.get(
    `/floors/${floorId}/nodes?boxCoordinates=${boxCoordinates}`,
  );

  return res.data;
};


export { getWalkingPathWithinBoundingBox };
