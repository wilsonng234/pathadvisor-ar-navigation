import { DefaultError, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Node from "../../../backend/schema/node";
import { getMapTileStartCoordinates, getMapTilesSize } from "../../utils";
import { FloorsDict, StorageKeys, storage } from "../../utils/storage_utils";

const useGetNodesByFloorId = (floors: FloorsDict | undefined, floorId: string) => {
    const nodes = storage.getString(StorageKeys.NODES_BY_FLOOR);

    const nodesByFloor = nodes ? JSON.parse(nodes) : {};
    const downloaded = nodesByFloor.hasOwnProperty(floorId);
    const isInternetReachable = true;
    // const { netInfo: { isInternetReachable } } = useNetInfoInstance();

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
        enabled: !!floors && !downloaded && isInternetReachable === true
    })

    if (downloaded) {
        const nodes: Node[] = nodesByFloor[floorId];
        return { data: nodes, isLoading: false };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetNodesByFloorId;
