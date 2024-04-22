import api from '../api';

const getMapTiles = async (floorId: string, x: number, y: number, zoomLevel: number) => {
    const res = await api.get(`/floors/${floorId}/map-tiles?x=${x}&y=${y}&zoomLevel=${zoomLevel}`,
        {
            responseType: 'arraybuffer'
        }
    )
        .catch((err) => {
            console.error(err);
            return null;
        });

    return res?.data;
};

export { getMapTiles };
