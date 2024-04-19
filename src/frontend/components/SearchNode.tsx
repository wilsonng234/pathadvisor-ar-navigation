import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UseQueryResult } from '@tanstack/react-query';

import Node from '../../backend/schema/Node';

import { FloorsDict, useFloorsQuery } from '../utils/reactQueryFactory';
import LoadingScreen from './LoadingScreen';
import useGetBuildings from '../hooks/api/useGetBuildings';


interface SearchNodeProps {
    node: Node;
    selectResult: (node: Node) => void;
}

const SearchNode = ({ node, selectResult }: SearchNodeProps) => {
    const { data: buildings, isLoading: isLoadingBuildings } = useGetBuildings();
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery()

    if (isLoadingBuildings || isLoadingFloors)
        return <LoadingScreen />;
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
