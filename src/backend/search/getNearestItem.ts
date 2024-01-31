import api from '../api';

const getNearestItem = async (
  type: string,
  startId: string | null = null,
  startName: string | null = null,
  sameFloor: boolean | null = null,
  mode: string | null = null,
  noStairCase: boolean | null = null,
  noEscalator: boolean | null = null,
  stepFreeAccess: boolean | null = null,
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

export default getNearestItem;
