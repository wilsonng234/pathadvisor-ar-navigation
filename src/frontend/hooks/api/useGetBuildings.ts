import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Building from "../../../backend/schema/building";
import { storage } from "../../utils/mmkvStorage"

type BuildingsDict = { [buildingId: string]: Building }

const useGetBuildings = (): { data: BuildingsDict | undefined, isLoading: boolean } => {
    const downloaded = storage.contains("buildings");
    const { netInfo: { isInternetReachable } } = useNetInfoInstance();

    const { data, isLoading } = useQuery<{ data: Building[] }, DefaultError, BuildingsDict>({
        queryKey: ['buildings'],
        queryFn: api.getAllBuildings,
        select: (res) => {
            const buildings: BuildingsDict = {}

            res.data.forEach((building: Building) => {
                buildings[building._id] = building
            })

            return buildings
        },
        staleTime: Infinity,
        enabled: !downloaded && isInternetReachable === true
    })

    if (downloaded) {
        const buildings = JSON.parse(storage.getString("buildings")!);
        const buildingsDict: BuildingsDict = {};

        buildings.forEach((building: Building) => {
            buildingsDict[building._id] = building;
        });

        return { data: buildingsDict, isLoading: false };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetBuildings;
