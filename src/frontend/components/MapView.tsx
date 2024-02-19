import React, { useEffect, useState } from "react"
import { ImageBackground, StyleSheet, View } from "react-native"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import * as api from "../../backend"
import { LocationNode, Path } from "../pages/PathAdvisorPage";
import { Polyline, Rect, Svg } from "react-native-svg";

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

    useEffect(() => {
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


                {/* if width&height match map size the app will crash. So scale it*/
                    path && path[floorId] &&
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
    map: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
