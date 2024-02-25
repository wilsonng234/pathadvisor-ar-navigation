import React, { useEffect, useState } from "react"
import { ImageBackground, StyleSheet, View, Image } from "react-native"
import { Polyline, Svg } from "react-native-svg";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import * as api from "../../backend/api"
import Node from "../../backend/schema/Node"
import PathNode from "../../backend/schema/PathNode";
import { Path } from "../pages/PathAdvisorPage";
import NodeView from "./NodeView";
import { useFloorsContext, useTagsContext } from "../pages/pathAdvisorPageContext";

interface MapViewProps {
    currentFloorId: string;
    fromNode: Node | null;
    toNode: Node | null;
    path: Path | null,
}

const MapView = ({ currentFloorId, fromNode, toNode, path }: MapViewProps) => {
    const floors = useFloorsContext();
    const tags = useTagsContext();
    const [showPin, setShowPin] = useState<boolean>(false);
    const [nodes, setNodes] = useState<Node[]>([]);

    if (!floors || !tags) {
        throw new Error('MapView must be used with fetched floors and tags');
    }

    useEffect(() => {
        setShowPin(!!fromNode && fromNode.floorId === currentFloorId);
    })

    useEffect(() => {
        const boxCoordinates = `${floors[currentFloorId].startX},${floors[currentFloorId].startY},${floors[currentFloorId].startX + floors[currentFloorId].mapWidth},${floors[currentFloorId].startY + floors[currentFloorId].mapHeight}`
        api.getNodesWithinBoundingBox(floors[currentFloorId]._id, boxCoordinates, true).then((res) => {
            setNodes(res.data);
        })
    }, [currentFloorId])

    return (
        <ReactNativeZoomableView
            initialZoom={0.3}
            minZoom={0.1}
            maxZoom={undefined}
            contentWidth={floors[currentFloorId].mapWidth}
            contentHeight={floors[currentFloorId].mapHeight}
        >
            <ImageBackground
                source={{
                    uri: `https://pathadvisor.ust.hk/api/floors/${currentFloorId}/map-image`
                }}
                style={{ ...styles.map, ...{ width: floors[currentFloorId].mapWidth, height: floors[currentFloorId].mapHeight } }}>

                {
                    showPin &&
                    <Image
                        style={[styles.pin, { left: fromNode!.centerCoordinates![0] - floors[currentFloorId].startX, top: fromNode!.centerCoordinates![1] - floors[currentFloorId].startY }]}
                        source={require('../assets/pin.png')}
                    />
                }

                {
                    path && path["floors"][currentFloorId] &&

                    /* Scale down the width and height of the container to reduce the size of the rendered Svg component */
                    <View style={{
                        height: floors[currentFloorId].mapHeight / 10,
                        width: floors[currentFloorId].mapWidth / 10,
                        transform: [{ scale: 10 }],
                    }}>
                        <Svg viewBox={`${floors[currentFloorId].startX} ${floors[currentFloorId].startY} ${floors[currentFloorId].mapWidth} ${floors[currentFloorId].mapHeight}`}>
                            <Polyline
                                points={path["floors"][currentFloorId].map((pathNode: PathNode) => `${pathNode.coordinates[0]},${pathNode.coordinates[1]}`).join(' ')}
                                stroke="red"
                                strokeWidth="10"
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

            </ImageBackground>
        </ReactNativeZoomableView>
    )
}

export default MapView;

const styles = StyleSheet.create({
    // render svg on top of the map
    map: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    pin: {
        position: 'absolute',
        resizeMode: 'contain',
    }
});
