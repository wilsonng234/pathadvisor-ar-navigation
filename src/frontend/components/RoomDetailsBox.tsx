import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultError, useQuery } from '@tanstack/react-query';

import * as api from '../../backend/api';
import Node from '../../backend/schema/Node';
import Floor from '../../backend/schema/Floor';
import Building from '../../backend/schema/Building';

import { convertFloorIdToFloorName } from '../utils';

interface RoomDetailsBoxProps {
    node: Node;
    renderButtons: () => JSX.Element;
}

const RoomDetailsBox = ({ node, renderButtons }: RoomDetailsBoxProps) => {
    const { data: buildings, isLoading: isLoadingBuildings } =
        useQuery<{ data: Building[] }, DefaultError, { [buildingId: string]: Building }>({
            queryKey: ["buildings"],
            queryFn: api.getAllBuildings,
            select: (res) => {
                const buildings: { [buildingId: string]: Building } = {};

                res.data.forEach((building: Building) => {
                    buildings[building._id] = building;
                });

                return buildings;
            },
            staleTime: Infinity
        })

    const { data: floors, isLoading: isLoadingFloors } =
        useQuery<{ data: Floor[] }, DefaultError, { [floorId: string]: Floor }>({
            queryKey: ["floors"],
            queryFn: api.getAllFloors,
            select: (res) => {
                const floors: { [floorId: string]: Floor } = {};

                res.data.forEach((floor: Floor) => {
                    floors[floor._id] = floor;
                });

                return floors;
            },
            staleTime: Infinity
        })

    if (isLoadingBuildings || isLoadingFloors)
        return <Text style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 80,
            color: 'red'
        }}>Loading...</Text>
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
