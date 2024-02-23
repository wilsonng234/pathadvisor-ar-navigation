import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Node from '../../backend/schema/Node';

interface SearchNodeProps {
    node: Node;
    selectResult: (node: Node) => void;
}

const SearchNode = ({ node, selectResult }: SearchNodeProps) => {
    return (
        <TouchableOpacity
            onPress={() => { selectResult(node) }}
        >
            <Text style={styles.searchResultText}>
                {node.name}, {node.floorId}
                {/* {node.buildingName} */}
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
