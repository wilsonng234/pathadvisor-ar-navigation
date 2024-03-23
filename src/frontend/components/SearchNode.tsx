import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UseQueryResult } from '@tanstack/react-query';

import Node from '../../backend/schema/Node';

import { BuildingsDict, FloorsDict, useBuildingsQuery, useFloorsQuery } from '../utils/reactQueryFactory';


interface SearchNodeProps {
    node: Node;
    selectResult: (node: Node) => void;
}

const SearchNode = ({ node, selectResult }: SearchNodeProps) => {
    const { data: buildings, isLoading: isLoadingBuildings }: UseQueryResult<BuildingsDict> = useBuildingsQuery()
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery()

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
