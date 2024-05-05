import React, { memo, useCallback } from "react"
import MapTilesBackground, { LOGIC_MAP_TILE_WIDTH, LOGIC_MAP_TILE_HEIGHT, RENDER_MAP_TILE_WIDTH, RENDER_MAP_TILE_HEIGHT } from "./MapTilesBackground";
import FastImage from "react-native-fast-image";
import { StyleSheet, View } from "react-native"
import { Polyline, Svg } from "react-native-svg";

import ZoomableView, { ZoomableViewRef } from "./ZoomableView";
import NodeView from "./NodeView";
import Node from "../../backend/schema/node"
import PathNode from "../../backend/schema/pathNode";
import useHomeStore from "../hooks/store/useHomeStore";
import useGetNodesByFloorId from "../hooks/api/useGetNodesByFloorId";
import { Path } from "../screens/Home";
import { getMapTileStartCoordinates, getMapTilesNumber, getMapTilesSize } from "../utils/mapTiles_utils";

interface MapViewProps {
    currentFloorId: string;
    fromNode: Node | null;
    toNode: Node | null;
    path: Path | null,
    focusNode: Node | null;
}

const MapView = ({ currentFloorId, fromNode, toNode, path, focusNode }: MapViewProps) => {
    const { floors } = useHomeStore();

    const { data: nodes, isLoading: isLoadingNodes } = useGetNodesByFloorId(floors, currentFloorId)
    const onZoomableViewRefChange = useCallback((ref: ZoomableViewRef) => {
        if (!floors || !nodes || !ref)
            return;

        let numCol: number, numRow: number;
        if (focusNode) {
            ({ numCol, numRow } = getMapTilesNumber(floors![focusNode.floorId], focusNode.coordinates![0], focusNode.coordinates![1]))
        }
        else {
            ({ numCol, numRow } = getMapTilesNumber(floors![currentFloorId], floors![currentFloorId].mobileDefaultX, floors![currentFloorId].mobileDefaultY))
        }

        ref.translate(
            -(numCol - 1) * RENDER_MAP_TILE_WIDTH,
            -(numRow - 1) * RENDER_MAP_TILE_HEIGHT
        )
    }, [floors, nodes, focusNode])

    if (!floors || !nodes)
        return <></>;

    // floors and nodes are guaranteed to be loaded at this point
    const { tileStartX, tileStartY } = getMapTileStartCoordinates(floors[currentFloorId]);
    const { renderWidth, renderHeight } = getMapTilesSize(floors[currentFloorId]);

    return (
        <View>
            <ZoomableView ref={onZoomableViewRefChange}>
                <MapTilesBackground floorId={currentFloorId}>
                    {
                        fromNode && fromNode.floorId === currentFloorId &&
                        <FastImage
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
                        <FastImage
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
                        nodes?.map((node: Node) =>
                            <NodeView key={node._id} currentFloorId={currentFloorId} node={node} />
                        )
                    }
                </MapTilesBackground>
            </ZoomableView>
        </View>
    )
}

export default memo(MapView);

const styles = StyleSheet.create({
    pin: {
        position: 'absolute',
        width: 4,
        height: 9,
        zIndex: 1
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
