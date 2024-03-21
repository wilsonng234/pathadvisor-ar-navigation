import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultError, useQuery } from '@tanstack/react-query';

import * as api from '../../backend/api';
import Node from '../../backend/schema/Node';
import Building from '../../backend/schema/Building';
import Floor from '../../backend/schema/Floor';


interface SearchNodeProps {
    node: Node;
    selectResult: (node: Node) => void;
}

const SearchNode = ({ node, selectResult }: SearchNodeProps) => {
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
    else
        return (
            <TouchableOpacity
                onPress={() => { selectResult(node) }}
            >
                <Text style={styles.searchResultText}>
                    {node.name}, {node.floorId}, {buildings![floors![node.floorId].buildingId].name}
                </Text>
            </TouchableOpacity>
        );
}

export default SearchNode;

const styles = StyleSheet.create({
    searchResultText: {
        color: "black",
        padding: 10,
    }
});
