import { DefaultError, UseQueryResult, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Node from "../../../backend/schema/node";

import { FloorsDict } from "./useGetFloors";
import { getMapTileStartCoordinates, getMapTilesSize } from "../../utils";
import { storage } from "../../utils/mmkvStorage";

const useNodesQueryByFloorId = (floors: FloorsDict | undefined, floorId: string) => {
    const downloaded = storage.contains(`nodes_${floorId}`);
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
        const nodes: Node[] = JSON.parse(storage.getString(`nodes_${floorId}`)!)
        return { data: nodes, isLoading: false };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useNodesQueryByFloorId;
