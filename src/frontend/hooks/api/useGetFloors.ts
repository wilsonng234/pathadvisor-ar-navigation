import { DefaultError, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Floor from "backend/schema/floor";
import { FloorsDict, StorageKeys, storage } from "../../utils/storage_utils"
import { useEffect, useState } from "react";


const useGetFloors = (): { data: FloorsDict | undefined, isLoading: boolean } => {
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [floors, setFloors] = useState<FloorsDict | undefined>(undefined);

    const { data, isLoading } = useQuery<{ data: Floor[] }, DefaultError, FloorsDict>({
        queryKey: ["floors"],
        queryFn: api.getAllFloors,
        select: (res) => {
            const floors: FloorsDict = res.data.reduce(
                (prev: FloorsDict, cur: Floor) => {
                    return { ...prev, [cur._id]: cur };
                }, {}
            );

            return floors;
        },
        staleTime: Infinity,
        enabled: !downloaded
    });

    useEffect(() => {
        setDownloaded(storage.contains(StorageKeys.FLOORS));
    }, [])

    useEffect(() => {
        if (downloaded)
            setFloors(JSON.parse(storage.getString(StorageKeys.FLOORS)!));
    }, [downloaded])

    if (downloaded) {
        if (floors)
            return { data: floors, isLoading: false };
        else
            return { data: undefined, isLoading: true };
    }
    else {
        return { data, isLoading };
    }
}

export default useGetFloors;
