import api from '../api';

const getShortestPath = async (
  fromId: string,
  toId: string,
  mode?: string,
  noStairCase?: boolean,
  noEscalator?: boolean,
  stepFreeAccess?: boolean,
  viaIds?: string[],
) => {
  const res = await api.get(
    `/shortest-path?fromId=${fromId}&toId=${toId}` +
    (mode ? `&mode=${mode}` : '') +
    (noStairCase ? `&noStairCase=${noStairCase}` : '') +
    (noEscalator ? `&noEscalator=${noEscalator}` : '') +
    (stepFreeAccess ? `&stepFreeAccess=${stepFreeAccess}` : '') +
    (viaIds ? viaIds.map(id => `&viaIds=${id}`).join('') : ''),
  ).catch((err) => {
    console.error(err);
    return null;
  });

  return res?.data;
};


export { getShortestPath };
