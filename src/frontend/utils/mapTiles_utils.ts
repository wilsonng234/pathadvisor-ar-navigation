import Floor from "../../backend/schema/floor";
import { FloorsDict, MapTileBlock } from "./storage_utils";
import { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH, RENDER_MAP_TILE_HEIGHT } from "../components/MapTilesBackground";

export const getMapTileStartCoordinates = (floor: Floor) => {
    const tileStartX = Math.floor(floor.startX / LOGIC_MAP_TILE_WIDTH) * LOGIC_MAP_TILE_WIDTH;
    const tileStartY = Math.floor(floor.startY / LOGIC_MAP_TILE_HEIGHT) * LOGIC_MAP_TILE_HEIGHT;
    return { tileStartX, tileStartY };
}

export const getMapTileEndCoordinates = (floor: Floor) => {
    const endX = floor.startX + floor.mapWidth;
    const endY = floor.startY + floor.mapHeight;

    const tileEndX = Math.ceil(endX / LOGIC_MAP_TILE_WIDTH) * LOGIC_MAP_TILE_WIDTH;
    const tileEndY = Math.ceil(endY / LOGIC_MAP_TILE_HEIGHT) * LOGIC_MAP_TILE_HEIGHT;

    return { tileEndX, tileEndY };
}

export const getMapTilesNumber = (floor: Floor, x?: number, y?: number) => {
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floor);

    if (x === undefined || y === undefined) {
        const { tileEndX, tileEndY } = getMapTileEndCoordinates(floor);
        x = tileEndX;
        y = tileEndY;
    }

    const numRow = Math.floor((y - tileStartY) / LOGIC_MAP_TILE_HEIGHT);
    const numCol = Math.floor((x - tileStartX) / LOGIC_MAP_TILE_WIDTH);

    return { numRow, numCol };
}

export const getMapTilesSize = (floor: Floor) => {
    const { numRow, numCol } = getMapTilesNumber(floor);

    return {
        logicWidth: numCol * LOGIC_MAP_TILE_WIDTH, logicHeight: numRow * LOGIC_MAP_TILE_HEIGHT,
        renderWidth: numCol * RENDER_MAP_TILE_WIDTH, renderHeight: numRow * RENDER_MAP_TILE_HEIGHT
    }
}

export const getFloorMapTileBlocks = (floors: FloorsDict, floorId: string) => {
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors[floorId]);
    const { numRow, numCol } = getMapTilesNumber(floors[floorId]);

    const mapTileBlocks = new Array<Array<MapTileBlock>>(numRow);
    for (let i = 0; i < numRow; i++) {
        mapTileBlocks[i] = new Array<MapTileBlock>(numCol);

        for (let j = 0; j < numCol; j++) {
            mapTileBlocks[i][j] = {
                floorId: floorId,
                x: j * LOGIC_MAP_TILE_WIDTH + tileStartX,
                y: i * LOGIC_MAP_TILE_HEIGHT + tileStartY,
                zoomLevel: 0
            }
        }
    }

    return mapTileBlocks;
}
