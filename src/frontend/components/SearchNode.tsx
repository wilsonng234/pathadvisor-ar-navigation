import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Node from '../../backend/schema/Node';
import { useBuildingsContext, useFloorsContext } from '../pages/pathAdvisorPageContext';

interface SearchNodeProps {
    node: Node;
    selectResult: (node: Node) => void;
}

const SearchNode = ({ node, selectResult }: SearchNodeProps) => {
    const buildings = useBuildingsContext();
    const floors = useFloorsContext();

    return (
        <TouchableOpacity
            onPress={() => { selectResult(node) }}
        >
            <Text style={styles.searchResultText}>
                {node.name}, {node.floorId}, {buildings[floors[node.floorId].buildingId].name}
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
