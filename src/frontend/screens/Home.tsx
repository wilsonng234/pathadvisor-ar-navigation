import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet, Text } from "react-native";
import { UseQueryResult } from "@tanstack/react-query";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

import SearchLocationBar from "../components/SearchLocationBar";
import MapView from "../components/MapView";
import RoomDetailsBox from "../components/RoomDetailsBox";
import LoadingScreen from "../components/LoadingScreen";

import * as api from '../../backend/api';
import Node from "../../backend/schema/Node";
import PathNode from "../../backend/schema/PathNode";
import PageSelector from "../components/PageSelector";

import { FloorsDict, useFloorsQuery } from "../utils/reactQueryFactory";

export interface Path {
    floorIds: string[];     // floorIds in the order of the path
    floors: { [floorId: string]: PathNode[] };  // pathNodes in each floor
}

enum NavigationType {
    Direction = "Direction",
    ARView = "ARView",
}

const HomeScreen = ({ navigation }) => {
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery();

    const [enableFromSearchBar, setEnableFromSearchBar] = useState<boolean>(false);
    const [fromNode, setFromNode] = useState<Node | null>(null);
    const [toNode, setToNode] = useState<Node | null>(null);
    const [path, setPath] = useState<Path | null>(null);
    const [currentFloorId, setCurrentFloorId] = useState<string>("1");  // default floor is 1
    const [navigationType, setNavigationType] = useState<NavigationType | null>(null);

    useEffect(() => {
        if (!fromNode) {
            if (toNode) {
                setCurrentFloorId(toNode.floorId)
            }
        }
        else {
            setCurrentFloorId(fromNode.floorId);
        }
    }, [toNode])

    useEffect(() => {
        if (fromNode)
            setCurrentFloorId(fromNode.floorId);
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

    const handleSelectorChangeFloor = (id: string) => {
        setCurrentFloorId(id);
    }

    const renderRoomDetailsBoxButtons = () => {
        const handleDirectionButton = () => {
            setEnableFromSearchBar(true);
            setNavigationType(NavigationType.Direction);
        }

        const handleARViewButton = () => {
            // setEnableFromSearchBar(true);
            navigation.navigate("AR Navigation", { toNode: toNode });
            // setNavigationType(NavigationType.ARView);
        }

        const disableARViewButton = !!floors && !!toNode && floors[toNode.floorId].buildingId !== 'academicBuilding';

        return (
            <View style={styles.roomDetailsBoxButtonsContainer}>
                <TouchableHighlight
                    style={styles.roomDetailsBoxButton}
                    onPress={handleDirectionButton}
                >
                    <Text style={styles.roomDetailsBoxButtonText}>Direction</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={[styles.roomDetailsBoxButton, disableARViewButton && styles.disabledButton]}
                    onPress={handleARViewButton}
                    disabled={disableARViewButton}
                >
                    <Text style={styles.roomDetailsBoxButtonText}>AR View</Text>
                </TouchableHighlight>
            </View>)
    }

    if (isLoadingFloors)
        return <LoadingScreen />;

    return (
        <View style={{ flex: 1 }}>
            <View style={{ zIndex: 2 }}>
                {
                    enableFromSearchBar &&
                    <SearchLocationBar selectNode={handleSelectFromNode} placeholder="FROM" onClickCancel={handleCancelFromNode} />
                }
                <SearchLocationBar selectNode={handleSelectToNode} placeholder="Where are you going?" onClickCancel={handleCancelToNode} />
            </View>

            <MapView currentFloorId={currentFloorId} fromNode={fromNode} toNode={toNode} path={path} focusNode={null} />

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
                (!path && (navigationType || !toNode)) &&
                <View style={styles.floorSelector}>
                    <PageSelector handleSelectorChangeFloor={handleSelectorChangeFloor} />
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

export default HomeScreen;

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
    disabledButton: {
        backgroundColor: "#dcdcdc"
    },
    floorSelector: {
        position: "absolute",
        bottom: 0

    }
});
