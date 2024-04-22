import { useEffect, useState } from "react";
import { DefaultError, useQuery } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Tag from "backend/schema/tag";
import { StorageKeys, TagsDict, storage } from "../../utils/storage_utils"

const useGetTags = (): { data: TagsDict | undefined, isLoading: boolean } => {
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [tags, setTags] = useState<TagsDict | undefined>(undefined);
    const isInternetReachable = true;

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
        setDownloaded(storage.contains(StorageKeys.TAGS));
    }, [])

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
    else {
        return { data, isLoading };
    }
}

export default useGetTags;
