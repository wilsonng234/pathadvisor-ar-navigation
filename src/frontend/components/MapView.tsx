import React, { useEffect, useState } from "react"
import { ImageBackground, StyleSheet, View, Image } from "react-native"
import { Polyline, Svg } from "react-native-svg";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import Node from "../../backend/schema/Node"
import Floor from "../../backend/schema/Floor";
import PathNode from "../../backend/schema/PathNode";
import { Path } from "../pages/PathAdvisorPage";

interface MapViewProps {
    floor: Floor;
    fromNode: Node | null;
    toNode: Node | null;
    path: Path
}

const MapView = ({ floor, fromNode, toNode, path }: MapViewProps) => {
    const [showPin, setShowPin] = useState<boolean>(false);

    useEffect(() => {
        setShowPin(!!fromNode && fromNode.floorId === floor._id);
    })

    return (
        <ReactNativeZoomableView
            initialZoom={0.3}
            minZoom={0.1}
            maxZoom={undefined}
            contentWidth={floor.mapWidth}
            contentHeight={floor.mapHeight}
        >
            <ImageBackground
                source={{
                    uri: `https://pathadvisor.ust.hk/api/floors/${floor._id}/map-image`
                }}
                style={{ ...styles.map, ...{ width: floor.mapWidth, height: floor.mapHeight } }}>

                {
                    showPin &&
                    <Image
                        style={[styles.pin, { left: fromNode!.centerCoordinates![0] - floor.startX, top: fromNode!.centerCoordinates![1] - floor.startY }]}
                        source={require('../assets/pin.png')}
                    />
                }

                {
                    path && path[floor._id] &&

                    /* Scale down the width and height of the container to reduce the size of the rendered Svg component */
                    <View style={{
                        height: floor.mapHeight / 10,
                        width: floor.mapWidth / 10,
                        transform: [{ scale: 10 }],
                    }}>
                        <Svg viewBox={`${floor.startX} ${floor.startY} ${floor.mapWidth} ${floor.mapHeight}`}>
                            <Polyline
                                points={path[floor._id].map((pathNode: PathNode) => `${pathNode.coordinates[0]},${pathNode.coordinates[1]}`).join(' ')}
                                stroke="red"
                                strokeWidth="10"
                                fill="none"
                            />
                        </Svg>
                    </View>
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
