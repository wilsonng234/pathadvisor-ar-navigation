import { MMKV } from 'react-native-mmkv'

import * as api from '../../backend/api';
import Building from '../../backend/schema/building';
import Floor from '../../backend/schema/floor';
import Tag from '../../backend/schema/tag';
import Node from '../../backend/schema/node';
import { getMapTileStartCoordinates, getMapTilesSize } from '.';

export const storage = new MMKV()

export enum StorageKeys {
    META_VERSION = 'meta',
    BUILDINGS = 'buildings',
    FLOORS = 'floors',
    TAGS = 'tags',
    NODES_BY_FLOOR = 'nodes_by_floor',
    FROM_SUGGESTIONS = 'from.suggestions',
    TO_SUGGESTIONS = 'to.suggestions',
    REACT_QUERY_OFFLINE_CACHE = 'REACT_QUERY_OFFLINE_CACHE'
}

export type BuildingsDict = { [buildingId: string]: Building }
export type FloorsDict = { [floorId: string]: Floor }
export type TagsDict = { [tagId: string]: Tag }
export type NodeByFloorDict = { [floorId: string]: Node[] }

export const downloadBuildings = async () => {
    const res = await api.getAllBuildings();
    const buildings: BuildingsDict = res.data.reduce(
        (prev: BuildingsDict, cur: Building) => {
            return { ...prev, [cur._id]: cur };
        }, {}
    );

    storage.set(StorageKeys.BUILDINGS, JSON.stringify(buildings));

    return buildings;
}

export const downloadFloors = async () => {
    const res = await api.getAllFloors();

    const floors: FloorsDict = res.data.reduce(
        (prev: FloorsDict, cur: Floor) => {
            return { ...prev, [cur._id]: cur };
        }, {}
    );

    storage.set(StorageKeys.FLOORS, JSON.stringify(floors));

    return floors;
}

export const downloadTags = async () => {
    const res = await api.getAllTags();
    const tags = res.data.reduce(
        (prev: TagsDict, cur: Tag) => {
            return { ...prev, [cur._id]: cur };
        }, {}
    );

    storage.set(StorageKeys.TAGS, JSON.stringify(tags));

    return tags;
}

export const downloadNodesByFloor = async (floors: FloorsDict) => {
    const nodesByFloor: { [floorId: string]: Node[] } = {};

    for (const floorId in floors) {
        const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![floorId]);
        const { logicWidth, logicHeight } = getMapTilesSize(floors![floorId]);
        const boxCoordinates = `${tileStartX},${tileStartY},${tileStartX + logicWidth},${tileStartY + logicHeight}`

        const res = await api.getNodesWithinBoundingBox(floors![floorId]._id, boxCoordinates, true);

        nodesByFloor[floorId] = res.data;
    }

    storage.set(StorageKeys.NODES_BY_FLOOR, JSON.stringify(nodesByFloor));

    return nodesByFloor;
}
