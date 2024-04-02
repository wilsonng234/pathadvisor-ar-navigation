import React, { useEffect, useState, useRef, useCallback, RefObject } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { UseQueryResult } from '@tanstack/react-query';
import { BuildingsDict, FloorsDict, useBuildingsQuery, useFloorsQuery } from '../utils/reactQueryFactory';

interface PageSelectorProps {
    handleSelectorChangeFloor: (id: string) => void;
}

const PageSelector = ({ handleSelectorChangeFloor }: PageSelectorProps) => {
    const { data: buildings, isLoading: isLoadingBuildings }: UseQueryResult<BuildingsDict> = useBuildingsQuery()
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery()
    const [floorButtons, setFloorButtons] = useState<string[]>([]);
    const [buildingButtons, setBuildingButtons] = useState<string[]>([]);
    const [buildingButtonsId, setBuildingButtonsId] = useState<string[]>([]);
    const [selectFloorIndex, setSelectFloorIndex] = useState(5);
    const [selectBuildingIndex, setSelectBuildingIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const changeFloor = (index: number, setCurrentFloorId: (id: string) => void) => {
        setSelectFloorIndex(index)
        setCurrentFloorId(floorButtons[index])
        scrollOffset();
    }

    const changeBuilding = (index: number) => {
        setSelectBuildingIndex(index)
        if (index === 0)
            changeFloor(5, handleSelectorChangeFloor);
        else
            changeFloor(0, handleSelectorChangeFloor);

        updateButtonList(index);
    }

    const updateButtonList = (index: number) => {
        if (floors === undefined || buildings === undefined) return;
        const tempFloorButtons: string[] = [];
        const tempBuildingButtonsId: string[] = [];
        Object.keys(buildings).forEach(element => {
            if (tempFloorButtons.indexOf(buildings[element]._id) === -1) {
                tempBuildingButtonsId.push(buildings[element]._id)
            }
        });
        Object.keys(floors).forEach(element => {
            if (floors[element].buildingId === tempBuildingButtonsId[index] && tempFloorButtons.indexOf(element) === -1) {
                tempFloorButtons.push(element)
            }
        });
        tempFloorButtons.sort((a, b) => {
            if (floors[a].rank > floors[b].rank) return 1;
            else return -1;
        })
        setBuildingButtonsId(tempBuildingButtonsId);
        setFloorButtons(tempFloorButtons);
    }

    const scrollOffset = () => {
        if (selectBuildingIndex === 0)
            scrollViewRef.current?.scrollTo({ x: 230, y: 0, animated: true });
        else
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }


    useEffect(() => {
        updateButtonList(0);
    }, [floors, buildings])

    useEffect(() => {
        const temp: string[] = [];
        buildingButtonsId.forEach(element => {
            if (buildings === undefined) return;
            temp.push(buildings[element].name)
        })
        setBuildingButtons(temp);
    }, [buildingButtonsId])

    if (isLoadingBuildings || isLoadingFloors)
        return <View></View>;
    else
        return (
            <View style={{ marginBottom: 20 }}>
                <View style={styles.buttonGroupContainer}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.contentContainer}
                    >
                        {buildingButtons.map((buttonLabel, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    index === selectBuildingIndex ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={() => changeBuilding(index)}
                            >
                                <Text style={styles.buttonText}>{buttonLabel}</Text>
                            </TouchableOpacity>
                        ))}

                    </ScrollView>
                </View>
                <View style={styles.buttonGroupContainer}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.contentContainer}
                        ref={scrollViewRef}
                        onContentSizeChange={() => {
                            scrollOffset();
                        }}
                    >
                        {floorButtons.map((buttonLabel, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    index === selectFloorIndex ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={() => changeFloor(index, handleSelectorChangeFloor)}
                            >
                                <Text style={styles.buttonText}>{buttonLabel}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
}

export default PageSelector;

const styles = StyleSheet.create({
    buttonGroupContainer: {
        marginBottom: 10,
        height: 40,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#E0E0E0',
    },
    contentContainer: {
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        marginHorizontal: 5,
        elevation: 2, // for Android shadow
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#FFFFFF',
    },
    inactiveButton: {
        backgroundColor: '#E0E0E0',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    }
});