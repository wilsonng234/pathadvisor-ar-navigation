import api from '../api';

const getNodesWithinBoundingBox = async (
  floorId: string,
  boxCoordinates: string,
  includePoints?: boolean,
) => {
  const res = await api.get(
    `/floors/${floorId}/nodes?boxCoordinates=${boxCoordinates}` +
    (includePoints ? `&includePoints=${includePoints}` : ``),
  );

  return res.data;
};


export { getNodesWithinBoundingBox };
