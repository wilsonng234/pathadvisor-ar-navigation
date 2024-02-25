import React from "react";
import { Image, Text, View, ViewStyle } from "react-native";

import Node from "../../backend/schema/Node";
import { getNodeImageByConnectorId } from "../plugins";
import { useFloorsContext, useTagsContext } from "../pages/pathAdvisorPageContext";

interface NodeViewProps {
    currentFloorId: string
    node: Node
}

const NodeView = ({ currentFloorId, node }: NodeViewProps) => {
    const floors = useFloorsContext();
    const tags = useTagsContext();

    if (!floors || !tags) {
        throw new Error('NodeView must be used with fetched floors and tags');
    }

    if (!node.centerCoordinates)
        return null;

    return <View style={styles.container(node.centerCoordinates[0] - floors[currentFloorId].startX, node.centerCoordinates[1] - floors[currentFloorId].startY)}>
        {
            // if node is a room, display the room name
            node.name?.toUpperCase().includes("ROOM") ?
                <Text style={styles.text}>
                    {node.name.replace("ROOM ", "")}
                </Text> :

                // else if node is a connector, display the connector image
                node.connectorId && getNodeImageByConnectorId(node.connectorId) ?
                    <Image
                        source={getNodeImageByConnectorId(node.connectorId)}
                        style={styles.icon} /> :

                    // else if node contains tagIds, display the image of first tag
                    node.tagIds && node.tagIds.length > 0 && tags[node.tagIds[0]].imageUrl ?
                        <Image
                            source={{ uri: tags[node.tagIds[0]].imageUrl }}
                            style={styles.icon} /> :

                        // else display the name of the node
                        <Text style={styles.text}>
                            {node.name}
                        </Text>
        }
    </View >
}

export default NodeView;

const styles = {
    container: (left: number, top: number): ViewStyle => ({
        position: 'absolute',
        left: left,
        top: top
    }),

    text: {
        fontSize: 20,
        color: 'black'
    },

    icon: {
        width: 20,
        height: 20
    }
};
