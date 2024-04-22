import { useEffect, useState } from "react";
import { DefaultError, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Building from "../../../backend/schema/building";
import { BuildingsDict, StorageKeys, storage } from "../../utils/storage_utils"

const useGetBuildings = (): { data: BuildingsDict | undefined, isLoading: boolean } => {
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [buildings, setBuildings] = useState<BuildingsDict | undefined>(undefined);

    const { data, isLoading } = useQuery<{ data: Building[] }, DefaultError, BuildingsDict>({
        queryKey: ['buildings'],
        queryFn: api.getAllBuildings,
        select: (res) => {
            const buildings: BuildingsDict = res.data.reduce(
                (prev: BuildingsDict, cur: Building) => {
                    return { ...prev, [cur._id]: cur };
                }, {}
            );

            return buildings
        },
        staleTime: Infinity,
        enabled: !downloaded
    })

    useEffect(() => {
        setDownloaded(storage.contains(StorageKeys.BUILDINGS));
    }, [])

    useEffect(() => {
        if (downloaded)
            setBuildings(JSON.parse(storage.getString(StorageKeys.BUILDINGS)!));
    }, [downloaded])

    if (downloaded) {
        if (buildings)
            return { data: buildings, isLoading: false };
        else
            return { data: undefined, isLoading: true };
    }
    else {
        return { data, isLoading };
    }
}

export default useGetBuildings;
