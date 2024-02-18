import React, { useEffect, useState } from "react"
import { ImageBackground, StyleSheet, Text } from "react-native"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import * as api from "../../backend"
import { LocationNode } from "../pages/PathAdvisorPage";

interface MapViewProps {
    floorId: string;
    fromNode: LocationNode | null;
    toNode: LocationNode | null;
}

const MapView = ({ floorId, fromNode, toNode }: MapViewProps) => {
    const [mapSize, setMapSize] = useState({ height: 1000, width: 1000 });

    useEffect(() => {
        api.getFloorById(floorId).then((res) => {
            setMapSize({
                height: res.data.mapHeigh,
                width: res.data.mapWidth
            })
        })


    }, [floorId])

    return (
        <ReactNativeZoomableView
            contentHeight={mapSize.height}
            contentWidth={mapSize.width}
        >
            <ImageBackground
                source={{
                    uri: `https://pathadvisor.ust.hk/api/floors/${floorId}/map-image`
                }}
                style={{ ...styles.map, ...{ height: 1000, width: 1000 } }}>

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
