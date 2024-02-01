import api from '../api';

const getShortestPath = async (
  fromId: string,
  toId: string,
  mode: string | null = null,
  noStairCase: boolean | null = null,
  noEscalator: boolean | null = null,
  stepFreeAccess: boolean | null = null,
  viaIds: string[] | null = null,
) => {
  const res = await api.get(
    `/shortest-path?fromId=${fromId}&toId=${toId}` +
    (mode ? `&mode=${mode}` : '') +
    (noStairCase ? `&noStairCase=${noStairCase}` : '') +
    (noEscalator ? `&noEscalator=${noEscalator}` : '') +
    (stepFreeAccess ? `&stepFreeAccess=${stepFreeAccess}` : '') +
    (viaIds ? viaIds.map(id => `&viaIds=${id}`).join('') : ''),
  );

  return res.data;
};


export { getShortestPath };
