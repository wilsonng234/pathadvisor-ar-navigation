import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import SearchLocationBar from "../components/SearchLocationBar";
import MapView from "../components/MapView";

import * as api from '../../backend/api';
import Floor from "../../backend/schema/Floor";
import Node from "../../backend/schema/Node";
import PathNode from "../../backend/schema/PathNode";
import Tag from "../../backend/schema/Tag";

export interface Path {
    floorIds: string[];     // floorIds in the order of the path
    floors: { [floorId: string]: PathNode[] };  // pathNodes in each floor
}

const PathAdvisorPage = () => {
    const [enableFromSearchBar, setEnableFromSearchBar] = useState<boolean>(false);
    const [fromNode, setFromNode] = useState<Node | null>(null);
    const [toNode, setToNode] = useState<Node | null>(null);
    const [floors, setFloors] = useState<{ [floorId: string]: Floor } | null>(null);
    const [tags, setTags] = useState<{ [tagId: string]: Tag } | null>(null);
    const [path, setPath] = useState<Path | null>(null);
    const [currentFloorId, setCurrentFloorId] = useState<string>("G");  // default floor is G

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

    useEffect(() => {
        setCurrentFloorId(fromNode ? fromNode.floorId : "G");
    }, [fromNode])

    // update path when fromNode or toNode changes
    useEffect(() => {
        if (!fromNode || !toNode)
            return;

        api.getShortestPath(fromNode._id, toNode._id).then((res) => {
            const path: Path = { "floorIds": [], "floors": {} };

            res.data.forEach((pathNode: PathNode) => {
                const floorId = pathNode.floorId;
                if (!path["floorIds"].includes(floorId))
                    path["floorIds"].push(floorId);

                if (!path["floors"].hasOwnProperty(floorId))
                    path["floors"][floorId] = [];

                path["floors"][floorId].push(pathNode);
            })

            setPath(path);
        })
    }, [fromNode, toNode])

    const handleSelectFromNode = (node: Node) => {
        setFromNode(node);
    }

    const handleSelectToNode = (node: Node) => {
        setEnableFromSearchBar(true);
        setToNode(node);
    }

    const handleChangeFloor = (offset: number) => {
        if (!path) {
            console.error("No path found");
            return
        }

        const index = path.floorIds.indexOf(currentFloorId);
        if (index + offset < 0 || index + offset >= path.floorIds.length) {
            console.error("Invalid floor index");
            return;
        }

        setCurrentFloorId(path.floorIds[index + offset]);
    }

    return (
        <>
            {
                enableFromSearchBar &&
                <SearchLocationBar selectNode={handleSelectFromNode} placeholder="FROM" />
            }
            <SearchLocationBar selectNode={handleSelectToNode} placeholder="Where are you going?" onClickCancel={() => setEnableFromSearchBar(false)} />

            {
                floors && tags &&
                <MapView floor={floors[currentFloorId]} fromNode={fromNode} toNode={toNode} path={path} tags={tags} />
            }

            {/* <View style={styles.mapDrawerOverlay} /> */}

            {
                path &&
                <View style={styles.pathFloorControlContainer}>
                    {
                        path.floorIds.indexOf(currentFloorId) > 0 &&
                        <TouchableOpacity onPress={() => { handleChangeFloor(-1) }} style={styles.pathFloorControlButtonContainer}>
                            <Icon
                                name="arrow-back-ios"
                                color="black"
                                style={{ marginLeft: 8 }}   // move icon to the center
                                size={20} />
                        </TouchableOpacity>
                    }

                    {
                        path.floorIds.indexOf(currentFloorId) + 1 < path.floorIds.length &&
                        <TouchableOpacity onPress={() => { handleChangeFloor(+1) }} style={styles.pathFloorControlButtonContainer}>
                            <Icon
                                name="arrow-forward-ios"
                                color="black"
                                size={20} />
                        </TouchableOpacity>
                    }
                </View>
            }
        </>
    );
}

export default PathAdvisorPage;

const styles = StyleSheet.create({
    // mapDrawerOverlay: {
    //     position: 'absolute',
    //     left: 0,
    //     top: 0,
    //     opacity: 0.0,
    //     height: Dimensions.get('window').height,
    //     width: '5%',
    // },

    pathFloorControlContainer: {
        position: "absolute",
        right: 10,
        bottom: 100,
        flexDirection: "row",
        width: 100,
        justifyContent: "space-around",
    },

    pathFloorControlButtonContainer: {
        width: 45,
        height: 45,
        borderRadius: 30,
        backgroundColor: "#1773c2",
        justifyContent: "center",
        alignItems: "center",
    }
});

