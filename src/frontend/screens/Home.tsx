import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet, Text, Pressable, Keyboard } from "react-native";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import SearchLocationBar, { SearchLocationBarRef } from "../components/SearchLocationBar";
import MapView from "../components/MapView";
import RoomDetailsBox from "../components/RoomDetailsBox";
import LoadingScreen from "../components/LoadingScreen";
import { useKeyboardVisible } from "..//hooks/listener/useKeyboardVisible";

import * as api from '../../backend/api';
import Node from "../../backend/schema/node";
import PathNode from "../../backend/schema/pathNode";
import FloorSelector from "../components/FloorSelector";
import useGetFloors from "../hooks/api/useGetFloors";
import useGetBuildings from "../hooks/api/useGetBuildings";
import useGetTags from "../hooks/api/useGetTags";
import useHomeStore from "../hooks/store/useHomeStore";

import { RootStackParamList } from "../Navigator";
import { StorageKeys, storage } from "../utils/storage_utils";
import { useDrawerStatus } from "@react-navigation/drawer";

export interface Path {
    floorIds: string[];     // floorIds in the order of the path
    floors: { [floorId: string]: PathNode[] };  // pathNodes in each floor
}

enum NavigationType {
    Direction = "Direction",
    ARView = "ARView",
}

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
    const { data: buildings, isLoading: isLoadingBuildings } = useGetBuildings();
    const { data: floors, isLoading: isLoadingFloors } = useGetFloors();
    const { data: tags, isLoading: isLoadingTags } = useGetTags();
    const [ready, setReady] = useState<boolean>(false);
    const [mapReady, setMapReady] = useState<boolean>(true);
    const { setBuildings, setFloors, setTags } = useHomeStore();
    const isKeyBoardVisible = useKeyboardVisible();

    const fromSearchLocationBarRef = useRef<SearchLocationBarRef>(null);
    const toSearchLocationBarRef = useRef<SearchLocationBarRef>(null);

    const [enableFromSearchBar, setEnableFromSearchBar] = useState<boolean>(false);
    const [fromNode, setFromNode] = useState<Node | null>(null);
    const [toNode, setToNode] = useState<Node | null>(null);
    const [path, setPath] = useState<Path | null>(null);
    const [currentFloorId, setCurrentFloorId] = useState<string>("1");  // default floor is 1
    const [navigationType, setNavigationType] = useState<NavigationType | null>(null);
    const [focusNode, setFocusNode] = useState<Node | null>(null);
    const [showRoomDetailsBox, setShowRoomDetailsBox] = useState<boolean>(false);

    const isDrawerOpen = useDrawerStatus() === 'open';

    useEffect(() => {
        if (isDrawerOpen)
            Keyboard.dismiss();
    }, [isDrawerOpen]);

    useEffect(() => {
        if (floors && buildings && tags) {
            setFloors(floors);
            setBuildings(buildings);
            setTags(tags);
            setReady(true);
        }
    }, [buildings, floors, tags]);

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

    useEffect(() => {
        setShowRoomDetailsBox(!navigationType && !!toNode);
    }, [navigationType, toNode])

    // update path when fromNode or toNode changes
    useEffect(() => {
        if (!fromNode || !toNode) {
            setPath(null);
        }
        else {
            setFocusNode(fromNode);

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

    const updateSuggestions = (cacheKey: string, nodeId: string) => {
        const getSuggestions = (cacheKey: string) => {
            const suggestions = storage.getString(cacheKey);
            return suggestions ? JSON.parse(suggestions) : [];
        }

        const setSuggestions = (cacheKey: string, suggestions: string[]) => {
            storage.set(cacheKey, JSON.stringify(suggestions));
        }

        const suggestions = getSuggestions(cacheKey);
        if (suggestions.includes(nodeId)) {
            suggestions.unshift(nodeId);

            suggestions.splice(suggestions.indexOf(nodeId), 1);
        }
        else {
            suggestions.unshift(nodeId);

            if (suggestions.length > 5)
                suggestions.pop();
        }
        setSuggestions(cacheKey, suggestions);
    }

    const handleSelectFromNode = (node: Node) => {
        setFromNode(node);
        updateSuggestions(StorageKeys.FROM_SUGGESTIONS, node._id);
    }

    const handleSelectToNode = useCallback((node: Node) => {
        setToNode(node);
        setFocusNode(node)
        updateSuggestions(StorageKeys.TO_SUGGESTIONS, node._id);
    }, [])

    const handleCancelFromNode = useCallback(() => {
        // setFromNode(null);
    }, [])

    const handleCancelToNode = useCallback(() => {
        // setFromNode(null);
        setToNode(null);
        setNavigationType(null);
        setEnableFromSearchBar(false);
    }, [])

    const handleCloseRoomDetailsBox = () => {
        handleCancelToNode();
        setShowRoomDetailsBox(false);
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
        setFocusNode(path.floors[path.floorIds[index + offset]][0])
    }

    const handleSelectorChangeFloor = useCallback((id: string) => {
        setCurrentFloorId(id);
        setFocusNode(null);
        setMapReady(false);
        setTimeout(() => {
            setMapReady(true)
        }, 500)
    }, []);

    const handlePressNonSearchBar = () => {
        fromSearchLocationBarRef.current?.setDisplayResults(false);
        toSearchLocationBarRef.current?.setDisplayResults(false);
        Keyboard.dismiss();
    }

    const renderRoomDetailsBoxButtons = () => {
        if (!floors || !toNode)
            return <></>

        const handleDirectionButton = () => {
            setEnableFromSearchBar(true);
            setNavigationType(NavigationType.Direction);
        }

        const handleARViewButton = () => {
            // setEnableFromSearchBar(true);
            navigation.navigate("AR Navigation", { toNode: toNode });
            // setNavigationType(NavigationType.ARView);
        }

        const disableARViewButton = floors[toNode.floorId].buildingId !== 'academicBuilding';
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

    if (!ready)
        return <LoadingScreen />;
    else
        return (
            <View style={{ flex: 1 }} >
                <View style={{ zIndex: 2 }}>
                    <View style={{ zIndex: 3 }}>
                        {
                            enableFromSearchBar &&
                            <SearchLocationBar
                                ref={fromSearchLocationBarRef}
                                selectNode={handleSelectFromNode}
                                placeholder="FROM"
                                onClickCancel={handleCancelFromNode}
                                cacheKey={StorageKeys.FROM_SUGGESTIONS}
                            />
                        }
                    </View>
                    <SearchLocationBar
                        ref={toSearchLocationBarRef}
                        selectNode={handleSelectToNode}
                        placeholder="Where are you going?"
                        onClickCancel={handleCancelToNode}
                        cacheKey={StorageKeys.TO_SUGGESTIONS}
                    />
                </View>
                {
                    !mapReady && <LoadingScreen />
                }
                {
                    mapReady && <Pressable onPress={handlePressNonSearchBar}>
                        <MapView currentFloorId={currentFloorId} fromNode={fromNode} toNode={toNode} path={path} focusNode={focusNode} />
                    </Pressable>
                }
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
                    !path && !showRoomDetailsBox && !isKeyBoardVisible &&
                    <Pressable style={styles.floorSelector} onPress={handlePressNonSearchBar}>
                        <FloorSelector currentFloorId={currentFloorId} handleSelectorChangeFloor={handleSelectorChangeFloor} />
                    </Pressable>
                }

                {
                    toNode && showRoomDetailsBox &&
                    <Pressable style={styles.roomDetailsBoxContainer} onPress={handlePressNonSearchBar}>
                        <RoomDetailsBox node={toNode} renderButtons={renderRoomDetailsBoxButtons} onClose={handleCloseRoomDetailsBox} />
                    </Pressable>
                }
            </View >
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
        bottom: 0,
        zIndex: 1,

    }
});
