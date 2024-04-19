import { DefaultError, UseQueryOptions, UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'

import * as api from '../../backend/api'
import Node from 'backend/schema/node';
import Floor from 'backend/schema/floor';
import Tag from 'backend/schema/tag';
import { getMapTileStartCoordinates, getMapTilesSize } from '.';

export type FloorsDict = { [floorId: string]: Floor }
export type TagsDict = { [tagId: string]: Tag }

export const useFloorsQuery = (): UseQueryResult<FloorsDict> => {
    return (
        useQuery<{ data: Floor[] }, DefaultError, FloorsDict>({
            queryKey: ["floors"],
            queryFn: api.getAllFloors,
            select: (res) => {
                const floors: FloorsDict = {};

                res.data.forEach((floor: Floor) => {
                    floors[floor._id] = floor;
                });

                return floors;
            },
            staleTime: Infinity
        }))
}

export const useTagsQuery = (): UseQueryResult<TagsDict> => {
    return (
        useQuery<{ data: Tag[] }, DefaultError, TagsDict>({
            queryKey: ["tags"],
            queryFn: api.getAllTags,
            select: (res) => {
                const tags: TagsDict = {};

                res.data.forEach((tag: Tag) => {
                    tags[tag._id] = tag;
                });

                return tags;
            },
            staleTime: Infinity
        })
    )
}

// export const useMapTilesQueryByFloorId = (floorId: string): UseQueryResult<string[]> => {
//     return (
//         useQuery<{ data: string[] }, DefaultError, string[]>({
//             queryKey: ["mapTiles", floorId],
//             queryFn: () => api.getMapTilesByFloorId(floorId),
//             select: (res) => res.data,
//             staleTime: Infinity
//         }
//         )
// }

export const useNodeQueriesByNodeIds = (nodeIds: string[]) => {
    return useQueries<UseQueryOptions<{ data: Node }>[]>(
        {
            queries: nodeIds.map(
                (nodeId) => {
                    return {
                        queryKey: ['node', nodeId],
                        queryFn: () => api.getNodeById(nodeId),
                        // select: (res) => res.data,
                        staleTime: Infinity,
                    }
                }
            ),
        }
    );
}

export const useNodesQueryByFloorId = (floors: FloorsDict | undefined, floorId: string): UseQueryResult<Node[]> => {
    return (
        useQuery<{ data: Node[] }, DefaultError, Node[]>({
            queryKey: ["nodes", floorId],
            queryFn: () => {
                const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![floorId]);
                const { logicWidth, logicHeight } = getMapTilesSize(floors![floorId]);
                const boxCoordinates = `${tileStartX},${tileStartY},${tileStartX + logicWidth},${tileStartY + logicHeight}`

                return api.getNodesWithinBoundingBox(floors![floorId]._id, boxCoordinates, true)
            },
            select: (res) => res.data,
            staleTime: Infinity,
            enabled: !!floors
        })
    )
}
