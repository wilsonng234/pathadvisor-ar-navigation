import { useEffect, useState } from "react";
import { DefaultError, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Node from "../../../backend/schema/node";
import { getMapTileStartCoordinates, getMapTilesSize } from "../../utils/mapTiles_utils";
import { FloorsDict, StorageKeys, storage } from "../../utils/storage_utils";

const useGetNodesByFloorId = (floors: FloorsDict | undefined, floorId: string) => {
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [floorNodes, setFloorNodes] = useState<Node[]>([]);

    const { data, isLoading } = useQuery<{ data: Node[] }, DefaultError, Node[]>({
        queryKey: ["nodes", floorId],
        queryFn: () => {
            const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![floorId]);
            const { logicWidth, logicHeight } = getMapTilesSize(floors![floorId]);
            const boxCoordinates = `${tileStartX},${tileStartY},${tileStartX + logicWidth},${tileStartY + logicHeight}`

            return api.getNodesWithinBoundingBox(floors![floorId]._id, boxCoordinates, true)
        },
        select: (res) => res.data,
        staleTime: Infinity,
        enabled: !!floors && !downloaded
    })

    useEffect(() => {
        const nodes = storage.getString(StorageKeys.NODES_BY_FLOOR);
        const nodesByFloors = nodes ? JSON.parse(nodes) : {};
        const downloaded = nodesByFloors.hasOwnProperty(floorId);
        setDownloaded(downloaded);

        if (downloaded) {
            setFloorNodes(nodesByFloors[floorId]);
        }
    }, [floorId]);

    if (downloaded) {
        if (floorNodes)
            return { data: floorNodes, isLoading: false };
        else
            return { data: [], isLoading: true };
    }
    else {
        return { data, isLoading };
    }
}

export default useGetNodesByFloorId;
