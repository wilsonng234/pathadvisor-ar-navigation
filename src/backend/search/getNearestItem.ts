import api from '../api';

const getNearestItem = async (
  type: string,
  startId?: string,
  startName?: string,
  sameFloor?: boolean,
  mode?: string,
  noStairCase?: boolean,
  noEscalator?: boolean,
  stepFreeAccess?: boolean,
) => {
  if (startId && startName) {
    throw new Error('Cannot specify both startId and startName');
  }

  const res = await api.get(
    `/nearest-item?type=${type}` +
    (startId ? `&startId=${startId}` : '') +
    (startName ? `&startName=${startName}` : '') +
    (sameFloor ? `&sameFloor=${sameFloor}` : '') +
    (mode ? `&mode=${mode}` : '') +
    (noStairCase ? `&noStairCase=${noStairCase}` : '') +
    (noEscalator ? `&noEscalator=${noEscalator}` : '') +
    (stepFreeAccess ? `&stepFreeAccess=${stepFreeAccess}` : ''),
  );

  return res.data;
};


export { getNearestItem };
