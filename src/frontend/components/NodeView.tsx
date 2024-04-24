import React, { memo, useState } from "react";
import FastImage from "react-native-fast-image";
import { LayoutChangeEvent, Text, View, ViewStyle } from "react-native";

import { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH } from "./MapTilesBackground";

import Node from "../../backend/schema/node";
import useHomeStore from "../hooks/store/useHomeStore";

import { getNodeImageByConnectorId } from "../utils";
import { getMapTileStartCoordinates } from "../utils/mapTiles_utils";

interface NodeViewProps {
    currentFloorId: string
    node: Node
}

interface NodeRenderSize {
    [nodeId: string]: {
        width: number
        height: number
    }
}

const NodeView = ({ currentFloorId, node }: NodeViewProps) => {
    const { floors, tags } = useHomeStore();
    const [nodeRenderSizes, setNodeRenderSizes] = useState<NodeRenderSize>({})

    if (!node.centerCoordinates)
        return null;

    // floors and tags are guaranteed to be loaded at this point
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![currentFloorId])

    const handleLayoutChange = (e: LayoutChangeEvent) => {
        setNodeRenderSizes({ ...nodeRenderSizes, [node._id]: { width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height } })
    }

    return <View style={styles.container((node.centerCoordinates[0] - tileStartX) * (RENDER_MAP_TILE_WIDTH / LOGIC_MAP_TILE_WIDTH), (node.centerCoordinates[1] - tileStartY) * (RENDER_MAP_TILE_HEIGHT / LOGIC_MAP_TILE_HEIGHT))}>
        {
            // if node is a room, display the room name
            node.name?.toUpperCase().includes("ROOM") ?
                <Text
                    style={[styles.text, styles.animatedNode(nodeRenderSizes[node._id]?.width, nodeRenderSizes[node._id]?.height)]}
                    onLayout={handleLayoutChange}
                >
                    {node.name.replace("ROOM ", "")}
                </Text> :

                // else if node is a connector, display the connector image
                node.connectorId && getNodeImageByConnectorId(node.connectorId) ?
                    <FastImage
                        style={[styles.icon, styles.animatedNode(nodeRenderSizes[node._id]?.width, nodeRenderSizes[node._id]?.height)]}
                        onLayout={handleLayoutChange}
                        source={getNodeImageByConnectorId(node.connectorId)}
                    /> :

                    // else if node contains tagIds, display the image of first tag
                    node.tagIds && node.tagIds.length > 0 && tags![node.tagIds[0]].imageUrl ?
                        <FastImage
                            style={[styles.icon, styles.animatedNode(nodeRenderSizes[node._id]?.width, nodeRenderSizes[node._id]?.height)]}
                            onLayout={handleLayoutChange}
                            source={{ uri: tags![node.tagIds[0]].imageUrl }}
                        /> :

                        // else display the name of the node
                        <Text
                            style={[styles.text, styles.animatedNode(nodeRenderSizes[node._id]?.width, nodeRenderSizes[node._id]?.height)]}
                            onLayout={handleLayoutChange}
                        >
                            {node.name}
                        </Text>
        }
    </View >
}

export default memo(NodeView);

const styles = {
    container: (left: number, top: number): ViewStyle => ({
        position: 'absolute',
        left: left,
        top: top
    }),

    text: {
        fontSize: 6,
        color: 'black',
    },

    // center the node
    animatedNode: (width: number, height: number) => ({
        transform: [{ translateX: width ? -width / 2 : 0 }, { translateY: height ? -height / 2 : 0 }]
    }),

    icon: {
        width: 10,
        height: 10
    }
};
