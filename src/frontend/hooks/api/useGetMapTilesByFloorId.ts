import { useEffect, useState } from "react";
import { StorageKeys, storage } from "../../utils/storage_utils";

const useGetMapTilesByFloorId = (floorId: string) => {
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [floorMapTiles, setFloorMapTiles] = useState<{ [mapTileKey: string]: string }>({});

    useEffect(() => {
        const mapTiles = storage.getString(StorageKeys.MAPTILES_BY_FLOOR);
        const mapTilesByFloors = mapTiles ? JSON.parse(mapTiles) : {};
        const downloaded = mapTilesByFloors.hasOwnProperty(floorId);
        setDownloaded(downloaded);

        if (downloaded) {
            setFloorMapTiles(mapTilesByFloors[floorId]);
        }
    }, [floorId]);

    if (downloaded) {
        if (floorMapTiles)
            return { data: floorMapTiles, isLoading: false, downloaded };
        else
            return { data: {}, isLoading: true, downloaded };
    }
    else {
        return { data: {}, isLoading: false, downloaded };
    }
}

export default useGetMapTilesByFloorId;
