import { Buffer } from 'buffer';
import { MMKV } from 'react-native-mmkv';

import * as api from '../../backend/api';
import Building from '../../backend/schema/building';
import Floor from '../../backend/schema/floor';
import Tag from '../../backend/schema/tag';
import Node from '../../backend/schema/node';
import { getMapTileStartCoordinates, getMapTilesNumber, getMapTilesSize } from '.';
import { LOGIC_MAP_TILE_HEIGHT, LOGIC_MAP_TILE_WIDTH } from '../components/MapTilesBackground';

export const storage = new MMKV()

export enum StorageKeys {
    META_VERSION = 'meta',
    BUILDINGS = 'buildings',
    FLOORS = 'floors',
    TAGS = 'tags',
    NODES_BY_FLOOR = 'nodes_by_floor',
    MAPTILES_BY_FLOOR = 'maptiles_by_floor',
    FROM_SUGGESTIONS = 'from_suggestions',
    TO_SUGGESTIONS = 'to_suggestions'
}

export type BuildingsDict = { [buildingId: string]: Building }
export type FloorsDict = { [floorId: string]: Floor }
export type TagsDict = { [tagId: string]: Tag }
export type NodeByFloorDict = { [floorId: string]: Node[] }
export type MapTilesByFloorDict = { [floorId: string]: { [mapTileKey: string]: string } }

export interface MapTileBlock {
    floorId: string;
    x: number;
    y: number;
    zoomLevel: number;
}

export const getBuildingsDict = async () => {
    const res = await api.getAllBuildings();
    const buildings: BuildingsDict = res.data.reduce(
        (prev: BuildingsDict, cur: Building) => {
            return { ...prev, [cur._id]: cur };
        }, {}
    );

    return buildings;
}

export const getFloorsDict = async () => {
    const res = await api.getAllFloors();
    const floors: FloorsDict = res.data.reduce(
        (prev: FloorsDict, cur: Floor) => {
            return { ...prev, [cur._id]: cur };
        }, {}
    );

    return floors;
}

export const getTagsDict = async () => {
    const res = await api.getAllTags();
    const tags = res.data.reduce(
        (prev: TagsDict, cur: Tag) => {
            return { ...prev, [cur._id]: cur };
        }, {}
    );

    return tags;
}

export const getNodesByFloorDict = async (floors: FloorsDict) => {
    const nodesByFloor: NodeByFloorDict = {};

    for (const floorId in floors) {
        const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![floorId]);
        const { logicWidth, logicHeight } = getMapTilesSize(floors![floorId]);
        const boxCoordinates = `${tileStartX},${tileStartY},${tileStartX + logicWidth},${tileStartY + logicHeight}`

        const res = await api.getNodesWithinBoundingBox(floors![floorId]._id, boxCoordinates, true);

        nodesByFloor[floorId] = res.data;
    }

    return nodesByFloor;
}

export const getMapTilesByFloorDict = async (floors: FloorsDict) => {
    const mapTilesByFloor: MapTilesByFloorDict = {};

    const getFloorMapTiles = async (mapTileBlocks: MapTileBlock[][], floorId: string) => {
        const mapTiles: { [mapTileKey: string]: string } = {};

        const promises = mapTileBlocks.map((row) => {
            return row.map(async (mapTileBlock) => {
                const mapTileKey = `${mapTileBlock.x}_${mapTileBlock.y}_${mapTileBlock.zoomLevel}`;
                const maptileBuffer = await api.getMapTiles(floorId, mapTileBlock.x, mapTileBlock.y, 0);
                const base64 = Buffer.from(maptileBuffer, 'binary').toString('base64');
                mapTiles[mapTileKey] = base64;
            })
        })

        await Promise.all(promises.flat());
        return mapTiles;
    }

    for (const floorId in floors) {
        const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors[floorId]);
        const { numRow, numCol } = getMapTilesNumber(floors[floorId]);
        const mapTileBlocks: MapTileBlock[][] = new Array<Array<MapTileBlock>>(numRow);

        for (let i = 0; i < numRow; i++) {
            mapTileBlocks[i] = new Array<MapTileBlock>(numCol);

            for (let j = 0; j < numCol; j++) {
                mapTileBlocks[i][j] = {
                    floorId: floorId,
                    x: j * LOGIC_MAP_TILE_WIDTH + tileStartX,
                    y: i * LOGIC_MAP_TILE_HEIGHT + tileStartY,
                    zoomLevel: 0
                };
            }
        }

        mapTilesByFloor[floorId] = await getFloorMapTiles(mapTileBlocks, floorId);
    }

    return mapTilesByFloor;
}
