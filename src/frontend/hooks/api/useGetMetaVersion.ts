import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Floor from "backend/schema/floor";
import { storage } from "../../utils/storage_utils"


const useGetMetaVersion = (): { data: string | undefined, isLoading: boolean } => {
    const { data, isLoading } = useQuery<{ data: { _id: string, version: string } }, DefaultError, string>({
        queryKey: ["metaVersion"],
        queryFn: api.getMeta,
        select: (res) => res.data.version
    });

    return { data, isLoading };
}

export default useGetMetaVersion;
