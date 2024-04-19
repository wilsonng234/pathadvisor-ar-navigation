import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LoadingScreen from './LoadingScreen';
import Node from '../../backend/schema/Node';
import useGetBuildings from '../hooks/api/useGetBuildings';
import useGetFloors from '../hooks/api/useGetFloors';
import { convertFloorIdToFloorName } from '../utils';

interface RoomDetailsBoxProps {
    node: Node;
    renderButtons: () => JSX.Element;
}

const RoomDetailsBox = ({ node, renderButtons }: RoomDetailsBoxProps) => {
    const { data: buildings, isLoading: isLoadingBuildings } = useGetBuildings();
    const { data: floors, isLoading: isLoadingFloors } = useGetFloors();

    if (isLoadingBuildings || isLoadingFloors)
        return <LoadingScreen />;
    else
        return (
            <View style={styles.roomDetailsBox}>
                <Text style={styles.roomName}>
                    {node.name}
                </Text>
                <Text style={styles.roomFloor}>
                    {buildings![floors![node.floorId].buildingId].name} {floors![node.floorId].name ? `- ${convertFloorIdToFloorName(floors![node.floorId].name)}` : ""}
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
