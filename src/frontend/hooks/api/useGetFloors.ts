import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Floor from "backend/schema/floor";
import { StorageKeys, storage } from "../../utils/mmkvStorage"

export type FloorsDict = { [floorId: string]: Floor }

const useGetFloors = (): { data: FloorsDict | undefined, isLoading: boolean } => {
    const downloaded = storage.contains(StorageKeys.FLOORS);
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

    if (downloaded) {
        const floors = JSON.parse(storage.getString(StorageKeys.FLOORS)!);
        const floordDict: FloorsDict = {};

        floors.forEach((floor: Floor) => {
            floordDict[floor._id] = floor;
        });

        return { data: floordDict, isLoading: false };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetFloors;
