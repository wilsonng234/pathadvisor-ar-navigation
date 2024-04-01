import React from "react";
import { Image, Text, View, ViewStyle } from "react-native";
import { UseQueryResult } from "@tanstack/react-query";

import { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH } from "./MapTilesBackground";

import Node from "../../backend/schema/Node";

import { getMapTileStartCoordinates, getNodeImageByConnectorId } from "../utils";
import { FloorsDict, TagsDict, useFloorsQuery, useTagsQuery } from "../utils/reactQueryFactory";
import LoadingScreen from "./LoadingScreen";

interface NodeViewProps {
    currentFloorId: string
    node: Node
}

const NodeView = ({ currentFloorId, node }: NodeViewProps) => {
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery()
    const { data: tags, isLoading: isLoadingTags }: UseQueryResult<TagsDict> = useTagsQuery()

    if (!node.centerCoordinates)
        return null;

    if (isLoadingFloors || isLoadingTags)
        return <LoadingScreen />;

    // floors and tags are guaranteed to be loaded at this point
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors![currentFloorId])

    return <View style={styles.container((node.centerCoordinates[0] - tileStartX) * (RENDER_MAP_TILE_WIDTH / LOGIC_MAP_TILE_WIDTH), (node.centerCoordinates[1] - tileStartY) * (RENDER_MAP_TILE_HEIGHT / LOGIC_MAP_TILE_HEIGHT))}>
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
                    node.tagIds && node.tagIds.length > 0 && tags![node.tagIds[0]].imageUrl ?
                        <Image
                            source={{ uri: tags![node.tagIds[0]].imageUrl }}
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
        fontSize: 6,
        color: 'black'
    },

    icon: {
        width: 10,
        height: 10
    }
};
