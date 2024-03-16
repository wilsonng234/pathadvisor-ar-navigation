import React, { useEffect, useMemo, useState } from "react"
import { StyleSheet, View, Image } from "react-native"
import { Polyline, Svg } from "react-native-svg";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import MapTilesBackground from "./MapTilesBackground";
import NodeView from "./NodeView";

import * as api from "../../backend/api"
import Node from "../../backend/schema/Node"
import PathNode from "../../backend/schema/PathNode";

import { Path } from "../pages/PathAdvisorPage";
import { useFloorsContext } from "../pages/pathAdvisorPageContext";

import { getMapTileStartCoordinates, getMapTilesSize } from "../utils";

interface MapViewProps {
    currentFloorId: string;
    fromNode: Node | null;
    toNode: Node | null;
    path: Path | null,
}

const MapView = ({ currentFloorId, fromNode, toNode, path }: MapViewProps) => {
    const floors = useFloorsContext();
    const [showPin, setShowPin] = useState<boolean>(false);
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        if (toNode)
            setShowPin(toNode.floorId === currentFloorId);
        else
            setShowPin(false);
    })

    const { tileStartX, tileStartY } = useMemo(() => {
        return getMapTileStartCoordinates(floors[currentFloorId])
    }, [currentFloorId])

    const { width: contentWidth, height: contentHeight } = useMemo(() => {
        return getMapTilesSize(floors[currentFloorId]);
    }, [currentFloorId])

    useEffect(() => {
        const boxCoordinates = `${tileStartX},${tileStartY},${tileStartX + contentWidth},${tileStartY + contentHeight}`
        api.getNodesWithinBoundingBox(floors[currentFloorId]._id, boxCoordinates, true).then((res) => {
            setNodes(res.data);
        })
    }, [tileStartX, tileStartY, contentWidth, contentHeight])

    return (
        <ReactNativeZoomableView
            initialZoom={0.3}
            minZoom={0.1}
            maxZoom={undefined}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
        >
            <MapTilesBackground floorId={currentFloorId}>
                {
                    toNode && showPin &&
                    <Image
                        style={[styles.pin, { left: toNode.centerCoordinates![0] - tileStartX, top: toNode.centerCoordinates![1] - tileStartY }]}
                        source={require('../assets/pin.png')}
                    />
                }

                {
                    path && path["floors"][currentFloorId] &&

                    <View style={[styles.pathContainer, { width: contentWidth / 10, height: contentHeight / 10, }]}>
                        <Svg viewBox={`${tileStartX} ${tileStartY} ${contentWidth} ${contentHeight}`}>
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
            </MapTilesBackground>
        </ReactNativeZoomableView >
    )
}

export default MapView;

const styles = StyleSheet.create({
    pin: {
        position: 'absolute',
        resizeMode: 'contain',
    },

    /* Scale down the width and height of the container to reduce the size of the rendered Svg component */
    pathContainer: {
        position: "absolute",
        top: 0,
        left: 0,

        transform: [{ scale: 10 }],
        transformOrigin: "top left",
    }
});
