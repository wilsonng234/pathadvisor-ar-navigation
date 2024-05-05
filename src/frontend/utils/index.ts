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
