import { DefaultError, UseQueryResult, useQuery } from '@tanstack/react-query'

import * as api from '../../backend/api'
import Node from 'backend/schema/node';
import Building from '../../backend/schema/building';
import Floor from 'backend/schema/floor';
import Tag from 'backend/schema/tag';
import { getMapTileStartCoordinates, getMapTilesSize } from '.';

export type BuildingsDict = { [buildingId: string]: Building }
export type FloorsDict = { [floorId: string]: Floor }
export type TagsDict = { [tagId: string]: Tag }

export const useBuildingsQuery = (): UseQueryResult<BuildingsDict> => {
    return (
        useQuery<{ data: Building[] }, DefaultError, BuildingsDict>({
            queryKey: ['buildings'],
            queryFn: api.getAllBuildings,
            select: (res) => {
                const buildings: BuildingsDict = {}

                res.data.forEach((building: Building) => {
                    buildings[building._id] = building
                })

                return buildings
            },
            staleTime: Infinity
        }))
}

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

export const useNodesQuery = (floors: FloorsDict | undefined, floorId: string): UseQueryResult<Node[]> => {
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
