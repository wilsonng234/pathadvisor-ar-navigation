import Floor from "backend/schema/floor";
import { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH, RENDER_MAP_TILE_HEIGHT } from "../components/MapTilesBackground";

export const getNodeImageByConnectorId = (connectorId: string) => {
    if (connectorId.toUpperCase().includes('LIFT')) {
        return require('../assets/lift.png');
    } else if (connectorId.toUpperCase().includes('STAIR')) {
        return require('../assets/stair.png');
    } else if (connectorId.toUpperCase().includes('ESCALATOR')) {
        return require('../assets/escalator.png');
    } else if (connectorId.toUpperCase().includes('Entrance')) {
        return require('../assets/crossBuildingConnector.png');
    }

    else {
        return false;
    }
}

export const convertFloorIdToFloorName = (floorId: string) => {
    const listToAddF = ['1', '2', '3', '4', '5', '6', '7', 'G'];

    if (listToAddF.includes(floorId)) {
        return floorId + '/F';
    } else {
        return floorId;
    }
}

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

export const getMapTilesNumber = (floor: Floor) => {
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floor);
    const { tileEndX, tileEndY } = getMapTileEndCoordinates(floor);

    const numRow = (tileEndY - tileStartY) / LOGIC_MAP_TILE_HEIGHT;
    const numCol = (tileEndX - tileStartX) / LOGIC_MAP_TILE_WIDTH;

    return { numRow, numCol };
}

export const getMapTilesSize = (floor: Floor) => {
    const { numRow, numCol } = getMapTilesNumber(floor);

    return {
        logicWidth: numCol * LOGIC_MAP_TILE_WIDTH, logicHeight: numRow * LOGIC_MAP_TILE_HEIGHT,
        renderWidth: numCol * RENDER_MAP_TILE_WIDTH, renderHeight: numRow * RENDER_MAP_TILE_HEIGHT
    }
}
