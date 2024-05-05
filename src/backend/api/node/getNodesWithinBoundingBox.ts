import api from '../api';

const getNodesWithinBoundingBox = async (
  floorId: string,
  boxCoordinates: string,
  includePoints?: boolean,
) => {
  const res = await api.get(
    `/floors/${floorId}/nodes?boxCoordinates=${boxCoordinates}` +
    (includePoints ? `&includePoints=${includePoints}` : ``),
  ).catch((err) => {
    console.error(err);
    return null;
  });

  return res?.data;
};


export { getNodesWithinBoundingBox };
