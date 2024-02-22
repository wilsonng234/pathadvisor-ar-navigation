import React from "react";
import { Image, Text, View, ViewStyle } from "react-native";

import Node from "../../backend/schema/Node";
import Floor from "../../backend/schema/Floor";
import Tag from "../../backend/schema/Tag";
import { getNodeImageByConnectorId } from "../plugins";

interface NodeViewProps {
    floor: Floor
    node: Node
    tags: { [tagId: string]: Tag }
}

const NodeView = ({ floor, node, tags }: NodeViewProps) => {
    if (!node.centerCoordinates)
        return null;

    return <View style={styles.container(node.centerCoordinates[0] - floor.startX, node.centerCoordinates[1] - floor.startY)}>
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
