import React, { useEffect, useMemo, useState } from "react"
import { StyleSheet, View, Image, Text } from "react-native"
import { Polyline, Svg } from "react-native-svg";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"
import { DefaultError, useQuery } from "@tanstack/react-query";

import MapTilesBackground, { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH, RENDER_MAP_TILE_HEIGHT } from "./MapTilesBackground";
import NodeView from "./NodeView";

import * as api from "../../backend/api"
import Node from "../../backend/schema/Node"
import Floor from "../../backend/schema/Floor";
import PathNode from "../../backend/schema/PathNode";

import { Path } from "../pages/PathAdvisorPage";
import { getMapTileStartCoordinates, getMapTilesSize } from "../utils";

interface MapViewProps {
    currentFloorId: string;
    fromNode: Node | null;
    toNode: Node | null;
    path: Path | null,
}

const MapView = ({ currentFloorId, fromNode, toNode, path }: MapViewProps) => {
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

    const [nodes, setNodes] = useState<Node[]>([]);

    const { tileStartX, tileStartY } = useMemo(() => {
        if (!floors)
            return { tileStartX: undefined, tileStartY: undefined }
        else {
            return getMapTileStartCoordinates(floors[currentFloorId])
        }
    }, [floors, currentFloorId])

    const { logicWidth, logicHeight, renderWidth, renderHeight } = useMemo(() => {
        if (!floors)
            return { logicWidth: undefined, logicHeight: undefined, renderWidth: undefined, renderHeight: undefined }
        else
            return getMapTilesSize(floors[currentFloorId]);
    }, [currentFloorId])

    useEffect(() => {
        if (!floors || !tileStartX || !tileStartY || !logicWidth || !logicHeight)
            return;

        const boxCoordinates = `${tileStartX},${tileStartY},${tileStartX + logicWidth},${tileStartY + logicHeight}`
        api.getNodesWithinBoundingBox(floors[currentFloorId]._id, boxCoordinates, true).then((res) => {
            setNodes(res.data);
        })
    }, [floors, tileStartX, tileStartY, logicWidth, logicHeight])

    if (isLoadingFloors || !tileStartX || !tileStartY || !logicWidth || !logicHeight)
        return <Text style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 80,
            color: 'red'
        }}>Loading...</Text>
    else {
        return (
            <ReactNativeZoomableView
                initialZoom={0.3}
                minZoom={0.1}
                maxZoom={undefined}
                contentWidth={renderWidth}
                contentHeight={renderHeight}
            >
                <MapTilesBackground floorId={currentFloorId}>
                    {
                        fromNode && fromNode.floorId === currentFloorId &&
                        <Image
                            style={
                                [styles.pin,
                                {
                                    left: (fromNode.centerCoordinates![0] - tileStartX) * (RENDER_MAP_TILE_WIDTH / LOGIC_MAP_TILE_WIDTH),
                                    top: (fromNode.centerCoordinates![1] - tileStartY) * (RENDER_MAP_TILE_HEIGHT / LOGIC_MAP_TILE_HEIGHT)
                                }]
                            }
                            source={require('../assets/pin.png')}
                        />
                    }
                    {
                        toNode && toNode.floorId === currentFloorId &&
                        <Image
                            style={
                                [styles.pin,
                                {
                                    left: (toNode.centerCoordinates![0] - tileStartX) * (RENDER_MAP_TILE_WIDTH / LOGIC_MAP_TILE_WIDTH),
                                    top: (toNode.centerCoordinates![1] - tileStartY) * (RENDER_MAP_TILE_HEIGHT / LOGIC_MAP_TILE_HEIGHT)
                                }]
                            }
                            source={require('../assets/pin.png')}
                        />
                    }

                    {
                        path && path["floors"][currentFloorId] &&

                        <View style={[styles.pathContainer, { width: renderWidth / 3, height: renderHeight / 3, }]}>
                            <Svg viewBox={`${tileStartX} ${tileStartY} ${renderWidth} ${renderHeight}`}>
                                <Polyline
                                    points={path["floors"][currentFloorId].map((pathNode: PathNode) =>
                                        `${tileStartX + ((pathNode.coordinates[0] - tileStartX) * (RENDER_MAP_TILE_WIDTH / LOGIC_MAP_TILE_WIDTH))},${tileStartY + (pathNode.coordinates[1] - tileStartY) * (RENDER_MAP_TILE_HEIGHT / LOGIC_MAP_TILE_HEIGHT)}`).join(' ')}
                                    stroke="red"
                                    strokeWidth="3"
                                    fill="none"
                                />
                            </Svg>
                        </View>
                    }

                    {
                        nodes.map((node: Node) =>
                            <NodeView key={node._id} currentFloorId={currentFloorId} node={node} />
                        )
                    }
                </MapTilesBackground>
            </ReactNativeZoomableView >
        )
    }
}

export default MapView;

const styles = StyleSheet.create({
    pin: {
        position: 'absolute',
        width: 4,
        height: 9
    },

    /* Scale down the width and height of the container to reduce the size of the rendered Svg component */
    pathContainer: {
        position: "absolute",
        top: 0,
        left: 0,

        transform: [{ scale: 3 }],
        transformOrigin: "top left",
    }
});
