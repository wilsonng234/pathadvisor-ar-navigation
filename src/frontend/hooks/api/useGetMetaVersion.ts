import { DefaultError, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";

const useGetMetaVersion = (): { data: string | undefined, isLoading: boolean } => {
    const { data, isLoading } = useQuery<{ data: { _id: string, version: string } }, DefaultError, string>({
        queryKey: ["metaVersion"],
        queryFn: api.getMeta,
        select: (res) => res.data.version
    });

    return { data, isLoading };
}

export default useGetMetaVersion;
