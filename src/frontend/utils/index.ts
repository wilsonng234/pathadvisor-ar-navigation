import Floor from "backend/schema/floor";
import { MAP_TILE_WIDTH, MAP_TILE_HEIGHT } from "../components/MapTilesBackground";

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
    const tileStartX = Math.floor(floor.startX / MAP_TILE_WIDTH) * MAP_TILE_WIDTH;
    const tileStartY = Math.floor(floor.startY / MAP_TILE_HEIGHT) * MAP_TILE_HEIGHT;
    return { tileStartX, tileStartY };
}

export const getMapTileEndCoordinates = (floor: Floor) => {
    const endX = floor.startX + floor.mapWidth;
    const endY = floor.startY + floor.mapHeight;

    const tileEndX = Math.ceil(endX / MAP_TILE_WIDTH) * MAP_TILE_WIDTH;
    const tileEndY = Math.ceil(endY / MAP_TILE_HEIGHT) * MAP_TILE_HEIGHT;

    return { tileEndX, tileEndY };
}

export const getMapTilesNumber = (floor: Floor) => {
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floor);
    const { tileEndX, tileEndY } = getMapTileEndCoordinates(floor);

    const numRow = (tileEndY - tileStartY) / MAP_TILE_HEIGHT;
    const numCol = (tileEndX - tileStartX) / MAP_TILE_WIDTH;

    return { numRow, numCol };
}

export const getMapTilesSize = (floor: Floor) => {
    const { numRow, numCol } = getMapTilesNumber(floor);

    return { width: numCol * MAP_TILE_WIDTH, height: numRow * MAP_TILE_HEIGHT };
}
