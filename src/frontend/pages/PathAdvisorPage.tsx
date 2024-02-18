import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import SearchLocationBar from "../components/SearchLocationBar";
import * as api from '../../backend/';
import MapView from "../components/MapView";

export interface LocationNode {
    _id: string;
    name: string;
    floorId: string;
}

export interface Floor {
    _id: string;
    startX: number;
    startY: number;
}

export interface Path {
    // floorId: [x, y]
    [floorId: string]: Array<[number, number]>;
}

export interface Tag {
    _id: string;
    imageUri: string;
    name: string;
}

const PathAdvisorPage = () => {
    const [enableToSearchBar, setEnableToSearchBar] = useState<boolean>(false);
    const [fromNode, setFromNode] = useState<LocationNode | null>(null);
    const [toNode, setToNode] = useState<LocationNode | null>(null);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [path, setPath] = useState<Path>({});

    // fetch floors on mount
    useEffect(() => {
        api.getAllFloors().then((res) => {
            const floors = res.data.map((floor: any) => ({
                _id: floor._id,
                startX: floor.startX,
                startY: floor.startY,
            }))

            setFloors(floors);
        })

    }, [])

    // fetch tags on mount
    useEffect(() => {
        api.getAllTags().then((res) => {
            setTags(res.data)
        });

    }, []);

    // update path when fromNode or toNode changes
    useEffect(() => {
        if (!fromNode || !toNode)
            return;

        api.getShortestPath(fromNode._id, toNode._id).then((res) => {
            const path = {};

            res.data.forEach((intermediateNode: any) => {
                if (path[intermediateNode.floorId] === undefined) {
                    path[intermediateNode.floorId] = [];
                }

                const floorId = intermediateNode.floorId;
                // assume floors are fetched
                path[floorId].push(
                    [intermediateNode.coordinates[0] - floors[floorId].startX, intermediateNode.coordinates[1] - floors[floorId].startY]
                );
            })

            setPath(path);
        })

    }, [fromNode, toNode])

    const handleSelectFromNode = (node: LocationNode) => {
        // floorViewRef.current?.setFloor(node.floorId);

        setEnableToSearchBar(true);
        setFromNode(node);
    }

    const handleSelectToNode = (node: LocationNode) => {
        setToNode(node);
    }

    return (
        <>
            <SearchLocationBar selectNode={handleSelectFromNode} placeholder="Search for a location" disableToSearchBar={() => setEnableToSearchBar(false)} />
            {enableToSearchBar && <SearchLocationBar selectNode={handleSelectToNode} placeholder="Search to a location" />}
            <MapView floorId={fromNode ? fromNode.floorId : 'G'} fromNode={fromNode} toNode={toNode} />
            {/* <MapView /> */}
            <View style={styles.mapDrawerOverlay} />
        </>
    );
}

export default PathAdvisorPage;

const styles = StyleSheet.create({
    mapDrawerOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.0,
        height: Dimensions.get('window').height,
        width: '5%',
    }
});

