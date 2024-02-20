import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import SearchLocationBar from "../components/SearchLocationBar";
import MapView from "../components/MapView";

import * as api from '../../backend/api';
import Floor from "../../backend/schema/Floor";
import Node from "../../backend/schema/Node";
import PathNode from "../../backend/schema/PathNode";
import Tag from "../../backend/schema/Tag";

export interface Path {
    [floorId: string]: Array<PathNode>;
}

const PathAdvisorPage = () => {
    const [enableToSearchBar, setEnableToSearchBar] = useState<boolean>(false);
    const [fromNode, setFromNode] = useState<Node | null>(null);
    const [toNode, setToNode] = useState<Node | null>(null);
    const [floors, setFloors] = useState<{ [floorId: string]: Floor }>({});
    const [tags, setTags] = useState<{ [tagId: string]: Tag }>({});
    const [path, setPath] = useState<Path>({});

    // fetch floors on mount
    useEffect(() => {
        api.getAllFloors().then((res) => {
            const floors = {}
            res.data.forEach((floor: Floor) => {
                floors[floor._id] = floor;
            })

            setFloors(floors);
        })
    }, [])

    // fetch tags on mount
    useEffect(() => {
        api.getAllTags().then((res) => {
            const tags = {};
            res.data.forEach((tag: Tag) => {
                tags[tag._id] = tag;
            })

            setTags(tags);
        });
    }, []);

    // update path when fromNode or toNode changes
    useEffect(() => {
        if (!fromNode || !toNode)
            return;

        api.getShortestPath(fromNode._id, toNode._id).then((res) => {
            const path = {};
            res.data.forEach((pathNode: PathNode) => {
                const floorId = pathNode.floorId;
                if (!path[floorId]) 
                    path[floorId] = [];
                path[floorId].push(pathNode);
            })

            setPath(path);
        })
    }, [fromNode, toNode])

    const handleSelectFromNode = (node: Node) => {
        setEnableToSearchBar(true);
        setFromNode(node);
    }

    const handleSelectToNode = (node: Node) => {
        setToNode(node);
    }

    return (
        <>
            <SearchLocationBar selectNode={handleSelectFromNode} placeholder="Search for a location" disableToSearchBar={() => setEnableToSearchBar(false)} />
            {enableToSearchBar && <SearchLocationBar selectNode={handleSelectToNode} placeholder="Search to a location" />}
            {Object.keys(floors).length > 0 && <MapView floor={fromNode ? floors[fromNode.floorId] : floors['G']} fromNode={fromNode} toNode={toNode} path={path} />}
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

