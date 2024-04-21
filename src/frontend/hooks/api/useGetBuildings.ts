import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Building from "../../../backend/schema/building";
import { BuildingsDict, StorageKeys, storage } from "../../utils/storage_utils"
import { useEffect, useState } from "react";

const useGetBuildings = (): { data: BuildingsDict | undefined, isLoading: boolean } => {
    const downloaded = storage.contains(StorageKeys.BUILDINGS);
    const [buildings, setBuildings] = useState<BuildingsDict | undefined>(undefined);
    const isInternetReachable = true;
    // const { netInfo: { isInternetReachable } } = useNetInfoInstance();

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

    useEffect(() => {
        if (downloaded)
            setBuildings(JSON.parse(storage.getString(StorageKeys.BUILDINGS)!));
    }, [downloaded])

    if (downloaded) {
        if (buildings)
            return { data: buildings, isLoading: false };
        return { data: undefined, isLoading: true };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetBuildings;
