import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useBuildingsContext, useFloorsContext } from '../pages/PathAdvisorContext';

import Node from '../../backend/schema/Node';
import { convertFloorIdToFloorName } from '../utils';

interface RoomDetailsBoxProps {
    node: Node;
    renderButtons: () => JSX.Element;
}

const RoomDetailsBox = ({ node, renderButtons }: RoomDetailsBoxProps) => {
    const buildings = useBuildingsContext();
    const floors = useFloorsContext();

    return (
        <View style={styles.roomDetailsBox}>
            <Text style={styles.roomName}>
                {node.name}
            </Text>
            <Text style={styles.roomFloor}>
                {buildings[floors[node.floorId].buildingId].name} - {convertFloorIdToFloorName(floors[node.floorId].name)}
            </Text>

            {renderButtons()}
        </View>
    );
}

export default RoomDetailsBox;

const styles = StyleSheet.create({
    roomDetailsBox: {
        flex: 1,
        backgroundColor: "#003366",
        borderRadius: 20,
        padding: 20,
        rowGap: 15,
    },

    roomName: {
        color: "white",
        fontSize: 20,
    },

    roomFloor: {
        color: "white",
        fontSize: 16,
    }
});
