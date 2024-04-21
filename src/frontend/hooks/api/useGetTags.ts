import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Tag from "backend/schema/tag";
import { StorageKeys, TagsDict, storage } from "../../utils/storage_utils"
import { useEffect, useState } from "react";

const useGetTags = (): { data: TagsDict | undefined, isLoading: boolean } => {
    const downloaded = storage.contains(StorageKeys.TAGS);
    const [tags, setTags] = useState<TagsDict | undefined>(undefined);
    const isInternetReachable = true;
    // const { netInfo: { isInternetReachable } } = useNetInfoInstance();

    const { data, isLoading } = useQuery<{ data: Tag[] }, DefaultError, TagsDict>({
        queryKey: ["tags"],
        queryFn: api.getAllTags,
        select: (res) => {
            const tags: TagsDict = {};

            res.data.forEach((tag: Tag) => {
                tags[tag._id] = tag;
            });

            return tags;
        },
        staleTime: Infinity,
        enabled: !downloaded && isInternetReachable === true
    })

    useEffect(() => {
        if (downloaded)
            setTags(JSON.parse(storage.getString(StorageKeys.TAGS)!));
    }, [downloaded])

    if (downloaded) {
        if (tags)
            return { data: tags, isLoading: false };
        else
            return { data: undefined, isLoading: true };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetTags;
