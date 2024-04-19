import { DefaultError, useQuery } from "@tanstack/react-query";
import { useNetInfoInstance } from "@react-native-community/netinfo";

import * as api from "../../../backend/api";
import Tag from "backend/schema/tag";
import { storage } from "../../utils/mmkvStorage"

type TagsDict = { [tagId: string]: Tag }

const useGetTags = (): { data: TagsDict | undefined, isLoading: boolean } => {
    const downloaded = storage.contains("tags");
    const { netInfo: { isInternetReachable } } = useNetInfoInstance();

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

    if (downloaded) {
        const tags = JSON.parse(storage.getString("tags")!);
        const tagsDict: TagsDict = {};

        tags.forEach((tag: Tag) => {
            tagsDict[tag._id] = tag;
        });

        return { data: tagsDict, isLoading: false };
    }
    if (isInternetReachable === false)
        return { data: undefined, isLoading: false };
    if (isLoading)
        return { data: undefined, isLoading: true };
    else
        return { data: data, isLoading: false };
}

export default useGetTags;
