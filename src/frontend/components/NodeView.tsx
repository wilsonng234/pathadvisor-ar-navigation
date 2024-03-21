import React from "react";
import { Image, Text, View, ViewStyle } from "react-native";
import { DefaultError, useQuery } from "@tanstack/react-query";

import { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH } from "./MapTilesBackground";

import * as api from "../../backend/api";
import Node from "../../backend/schema/Node";
import Floor from "../../backend/schema/Floor";
import Tag from "../../backend/schema/Tag";

import { getMapTileStartCoordinates, getNodeImageByConnectorId } from "../utils";

interface NodeViewProps {
    currentFloorId: string
    node: Node
}

const NodeView = ({ currentFloorId, node }: NodeViewProps) => {
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

    const { data: tags, isLoading: isLoadingTags } =
        useQuery<{ data: Tag[] }, DefaultError, { [tagId: string]: Tag }>({
            queryKey: ["tags"],
            queryFn: api.getAllTags,
            select: (res) => {
                const tags: { [tagId: string]: Tag } = {};

                res.data.forEach((tag: Tag) => {
                    tags[tag._id] = tag;
                });

                return tags;
            },
            staleTime: Infinity
        })

    if (!node.centerCoordinates)
        return null;

    if (isLoadingFloors || isLoadingTags)
        return <Text style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 80,
            color: 'red'
        }}>Loading...</Text>

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
