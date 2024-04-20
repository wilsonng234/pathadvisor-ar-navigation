import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Floor from "backend/schema/floor";
import { storage } from "../../utils/mmkvStorage"


const useGetMetaVersion = (): { data: string | undefined, isLoading: boolean } => {
    const { data, isLoading } = useQuery<{ data: { _id: string, version: string } }, DefaultError, string>({
        queryKey: ["floors"],
        queryFn: api.getMeta,
        select: (res) => res.data.version,
        staleTime: Infinity,
        enabled: !downloaded && isInternetReachable === true
    });

    if (downloaded) {
        const floors = JSON.parse(storage.getString("floors")!);
        const floordDict: FloorsDict = {};

        floors.forEach((floor: Floor) => {
            floordDict[floor._id] = floor;
        });

        return { data: floordDict, isLoading: false };
    }

    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetMetaVersion;
