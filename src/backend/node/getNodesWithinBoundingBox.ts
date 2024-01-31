import api from '../api';

const getNodesWithinBoundingBox = async (
  floorId: string,
  boxCoordinates: string,
  includePoints: boolean | null = null,
) => {
  const res = await api.get(
    `/floors/${floorId}/nodes?boxCoordinates=${boxCoordinates}` +
      (includePoints ? `&includePoints=${includePoints}` : ``),
  );

  return res.data;
};

export default getNodesWithinBoundingBox;
