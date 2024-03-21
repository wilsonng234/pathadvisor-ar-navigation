import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet, Text } from "react-native";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import { DefaultError, useQuery } from "@tanstack/react-query";

import SearchLocationBar from "../components/SearchLocationBar";
import MapView from "../components/MapView";
import RoomDetailsBox from "../components/RoomDetailsBox";

import * as api from '../../backend/api';
import Building from "../../backend/schema/Building";
import Floor from "../../backend/schema/Floor";
import Tag from "../../backend/schema/Tag";
import Node from "../../backend/schema/Node";
import PathNode from "../../backend/schema/PathNode";

export interface Path {
    floorIds: string[];     // floorIds in the order of the path
    floors: { [floorId: string]: PathNode[] };  // pathNodes in each floor
}

enum NavigationType {
    Direction = "Direction",
    ARView = "ARView",
}

const PathAdvisorPage = () => {
    const [enableFromSearchBar, setEnableFromSearchBar] = useState<boolean>(false);
    const [fromNode, setFromNode] = useState<Node | null>(null);
    const [toNode, setToNode] = useState<Node | null>(null);
    const [path, setPath] = useState<Path | null>(null);
    const [currentFloorId, setCurrentFloorId] = useState<string>("G");  // default floor is G
    const [navigationType, setNavigationType] = useState<NavigationType | null>(null);

    const { data: buildings, isLoading: isLoadingBuildings } =
        useQuery<{ data: Building[] }, DefaultError, { [buildingId: string]: Building }>({
            queryKey: ["buildings"],
            queryFn: api.getAllBuildings,
            select: (res) => {
                const buildings: { [buildingId: string]: Building } = {};

                res.data.forEach((building: Building) => {
                    buildings[building._id] = building;
                });

                return buildings;
            },
            staleTime: Infinity
        })

    const { data: floors, isLoading: isLoadingFloors } =
        useQuery<{ data: Floor[] }, DefaultError, { [floorId: string]: Floor }>({
            queryKey: ["floors"],
            queryFn: api.getAllFloors,
            select: (res) => {
                const floors: { [floorId: string]: Floor } = {};

                res.data.forEach((floor: Floor) => {
                    floors[floor._id] = floor;
                });

                return floors;
            },
            staleTime: Infinity
        })

    const { data: tags, isLoading: isLoadingTags } =
        useQuery<{ data: Tag[] }, DefaultError, { [tagId: string]: Tag }>({
            queryKey: ["tags"],
            queryFn: api.getAllTags,
            select: (res) => {
                const tags: { [tagId: string]: Tag } = {};

                res.data.forEach((tag: Tag) => {
                    tags[tag._id] = tag;
                });

                return tags;
            },
            staleTime: Infinity
        })

    useEffect(() => {
        if (!fromNode)
            setCurrentFloorId(toNode ? toNode.floorId : "1")
        else
            setCurrentFloorId(fromNode.floorId);
    }, [toNode])

    useEffect(() => {
        setCurrentFloorId(fromNode ? fromNode.floorId : "1");
    }, [fromNode])

    // update path when fromNode or toNode changes
    useEffect(() => {
        if (!fromNode || !toNode) {
            setPath(null);
        }
        else {
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
        }
    }, [fromNode, toNode])

    const handleSelectFromNode = (node: Node) => {
        setFromNode(node);
    }

    const handleSelectToNode = (node: Node) => {
        setToNode(node);
    }

    const handleCancelFromNode = () => {
        setFromNode(null);
    }

    const handleCancelToNode = () => {
        setToNode(null);
        setNavigationType(null);
        setFromNode(null);
        setEnableFromSearchBar(false);
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

    const renderRoomDetailsBoxButtons = () => {
        const handleDirectionButton = () => {
            setEnableFromSearchBar(true);
            setNavigationType(NavigationType.Direction);
        }

        const handleARViewButton = () => {
            setEnableFromSearchBar(true);
            setNavigationType(NavigationType.ARView);
        }

        return <View style={styles.roomDetailsBoxButtonsContainer}>
            <TouchableHighlight
                style={styles.roomDetailsBoxButton}
                onPress={handleDirectionButton}
            >
                <Text style={styles.roomDetailsBoxButtonText}>Direction</Text>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.roomDetailsBoxButton}
                onPress={handleARViewButton}
            >
                <Text style={styles.roomDetailsBoxButtonText}>AR View</Text>
            </TouchableHighlight>
        </View>
    }

    if (isLoadingBuildings || isLoadingFloors || isLoadingTags) {
        return <Text style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 80,
            color: 'red'
        }}>Loading...</Text>
    }
    else
        return (
            <View style={{ flex: 1 }}>
                <View style={{ zIndex: 2 }}>
                    {
                        enableFromSearchBar &&
                        <SearchLocationBar selectNode={handleSelectFromNode} placeholder="FROM" onClickCancel={handleCancelFromNode} />
                    }
                    <SearchLocationBar selectNode={handleSelectToNode} placeholder="Where are you going?" onClickCancel={handleCancelToNode} />
                </View>

                <MapView currentFloorId={currentFloorId} fromNode={fromNode} toNode={toNode} path={path} />

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

                {
                    !navigationType && toNode &&
                    <View style={styles.roomDetailsBoxContainer}>
                        <RoomDetailsBox node={toNode} renderButtons={renderRoomDetailsBoxButtons} />
                    </View>
                }
            </View>
        );
}

export default PathAdvisorPage;

const styles = StyleSheet.create({
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
    },

    roomDetailsBoxContainer: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        width: "95%",
        height: 170
    },

    roomDetailsBoxButtonsContainer: {
        flexDirection: "row",
        columnGap: 8,
    },

    roomDetailsBoxButton: {
        backgroundColor: "#428bca",
        padding: 5,
        borderRadius: 12,
        width: 100
    },

    roomDetailsBoxButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
    },
});
