import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UseQueryResult } from '@tanstack/react-query';

import Node from '../../backend/schema/Node';

import { convertFloorIdToFloorName } from '../utils';
import { BuildingsDict, FloorsDict, useBuildingsQuery, useFloorsQuery } from '../utils/reactQueryFactory';

interface RoomDetailsBoxProps {
    node: Node;
    renderButtons: () => JSX.Element;
}

const RoomDetailsBox = ({ node, renderButtons }: RoomDetailsBoxProps) => {
    const { data: buildings, isLoading: isLoadingBuildings }: UseQueryResult<BuildingsDict> = useBuildingsQuery();
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery();

    if (isLoadingBuildings || isLoadingFloors)
        return <Text style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 80,
            color: 'red'
        }}>Loading...</Text>
    else
        return (
            <View style={styles.roomDetailsBox}>
                <Text style={styles.roomName}>
                    {node.name}
                </Text>
                <Text style={styles.roomFloor}>
                    {buildings![floors![node.floorId].buildingId].name} {floors![node.floorId].name ? `- ${convertFloorIdToFloorName(floors![node.floorId].name)}}` : ""}
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
