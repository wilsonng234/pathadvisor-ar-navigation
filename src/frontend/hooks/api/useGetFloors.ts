import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Floor from "backend/schema/floor";
import { FloorsDict, StorageKeys, storage } from "../../utils/storage_utils"
import { useEffect, useState } from "react";


const useGetFloors = (): { data: FloorsDict | undefined, isLoading: boolean } => {
    const downloaded = storage.contains(StorageKeys.FLOORS);
    const [floors, setFloors] = useState<FloorsDict | undefined>(undefined);
    const isInternetReachable = true;
    // const { netInfo: { isInternetReachable } } = useNetInfoInstance();

    const { data, isLoading } = useQuery<{ data: Floor[] }, DefaultError, FloorsDict>({
        queryKey: ["floors"],
        queryFn: api.getAllFloors,
        select: (res) => {
            const floors: FloorsDict = {};

            res.data.forEach((floor: Floor) => {
                floors[floor._id] = floor;
            });

            return floors;
        },
        staleTime: Infinity,
        enabled: !downloaded && isInternetReachable === true
    });

    useEffect(() => {
        setFloors(JSON.parse(storage.getString(StorageKeys.FLOORS)!));
    }, [downloaded])

    if (downloaded) {
        if (floors)
            return { data: floors, isLoading: false };
        return { data: undefined, isLoading: true };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetFloors;
