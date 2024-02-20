import React, { useEffect, useState } from "react"
import { ImageBackground, StyleSheet, View, Image } from "react-native"
import { Polyline, Svg } from "react-native-svg";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import * as api from "../../backend/api"
import { LocationNode, Path } from "../pages/PathAdvisorPage";

interface MapViewProps {
    floorId: string;
    fromNode: LocationNode | null;
    toNode: LocationNode | null;
    path: Path
}

interface MapData {
    startX: number;
    startY: number;
    mapHeight: number;
    mapWidth: number;
}

const MapView = ({ floorId, fromNode, toNode, path }: MapViewProps) => {
    const [mapData, setMapData] = useState<MapData>({ startX: 0, startY: 0, mapWidth: 1000, mapHeight: 1000 });
    const [showPin, setShowPin] = useState<boolean>(false);

    useEffect(() => {
        setShowPin(!!fromNode && fromNode.floorId === floorId);

        api.getFloorById(floorId).then((res) => {
            setMapData({
                startX: res.data.startX,
                startY: res.data.startY,
                mapWidth: res.data.mapWidth,
                mapHeight: res.data.mapHeight,
            })
        })
    }, [floorId])

    return (
        <ReactNativeZoomableView
            initialZoom={0.3}
            minZoom={0.1}
            maxZoom={undefined}
            contentWidth={mapData.mapWidth}
            contentHeight={mapData.mapHeight}
        >
            <ImageBackground
                source={{
                    uri: `https://pathadvisor.ust.hk/api/floors/${floorId}/map-image`
                }}
                style={{ ...styles.map, ...{ width: mapData.mapWidth, height: mapData.mapHeight } }}>

                {
                    showPin &&
                    <Image
                        style={[styles.pin, { left: fromNode!.centerCoordinates[0] - mapData.startX, top: fromNode!.centerCoordinates[1] - mapData.startY }]}
                        source={require('../assets/pin.png')}
                    />
                }

                {
                    path && path[floorId] &&

                    /* Scale down the width and height of the container to reduce the size of the rendered Svg component */
                    <View style={{
                        height: mapData.mapHeight / 10,
                        width: mapData.mapWidth / 10,
                        transform: [{ scale: 10 }],
                    }}>
                        <Svg viewBox={`${mapData.startX} ${mapData.startY} ${mapData.mapWidth} ${mapData.mapHeight}`}>
                            <Polyline
                                points={path[floorId].map(([x, y]) => `${x},${y}`).join(' ')}
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
