import React, { useEffect, useState, useRef, useCallback, RefObject } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { UseQueryResult } from '@tanstack/react-query';
import { BuildingsDict, FloorsDict, useBuildingsQuery, useFloorsQuery } from '../utils/reactQueryFactory';

interface PageSelectorProps {
    handleSelectorChangeFloor: (id: string) => void;
}

type FloorsButtonsDict = { [buildingId: string]: string[] }

const PageSelector = ({ handleSelectorChangeFloor }: PageSelectorProps) => {
    const { data: buildings, isLoading: isLoadingBuildings }: UseQueryResult<BuildingsDict> = useBuildingsQuery()
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery()
    // const [floorButtons, setFloorButtons] = useState<string[]>([]);
    const [floorButtonList, setFloorButtonList] = useState<FloorsButtonsDict>({});
    const [buildingList, setBuildingList] = useState<string[]>([]);
    const [buildingButtons, setBuildingButtons] = useState<string[]>([]);
    // const [buildingButtonsId, setBuildingButtonsId] = useState<string[]>([]);
    const [selectFloorIndex, setSelectFloorIndex] = useState(6);
    const [selectBuildingIndex, setSelectBuildingIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (floors === undefined) return;
        const tempFloorButtonList: FloorsButtonsDict = {};
        const tempBuildingList: string[] = [];
        Object.keys(floors).forEach(floorId => {
            if (tempFloorButtonList[floors[floorId].buildingId] === undefined) {
                tempFloorButtonList[floors[floorId].buildingId] = [];
            }
            tempFloorButtonList[floors[floorId].buildingId].push(floorId);
        });
        Object.keys(tempFloorButtonList).forEach(building => {
            tempBuildingList.push(building);
            tempFloorButtonList[building].sort((a, b) => {
                if (floors[a].rank > floors[b].rank) return 1;
                else return -1;
            })
        });
        setBuildingList(tempBuildingList);
        console.log(tempFloorButtonList);
        setFloorButtonList(tempFloorButtonList);
        console.log(floorButtonList);
    }, [])
    const changeFloor = (index: number) => {
        setSelectFloorIndex(index)
        if (floorButtonList !== undefined && buildingList !== undefined) {
            console.log(floorButtonList, buildingList, selectBuildingIndex, index)
            const tempList = floorButtonList[buildingList[selectBuildingIndex]];
            if (!!tempList) {
                handleSelectorChangeFloor(floorButtonList[buildingList[selectBuildingIndex]][index])
            }
        }
        scrollOffset();
    }

    const changeBuilding = (index: number) => {
        setSelectBuildingIndex(index)
        // if (index === 0)
        //     changeFloor(6);
        // else
        //     changeFloor(0);
    }

    const scrollOffset = () => {
        if (selectBuildingIndex === 0)
            scrollViewRef.current?.scrollTo({ x: 230, y: 0, animated: true });
        else
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }

    useEffect(() => {
        const temp: string[] = [];
        buildingList.forEach(building => {
            if (buildings === undefined) return;
            temp.push(buildings[building].name)
        })
        setBuildingButtons(temp);
    }, [buildings, buildingList])

    useEffect(() => {
        // console.log(selectBuildingIndex ?? 0)
        changeFloor(selectBuildingIndex === 0 ? 6 : 0);
    }, [selectBuildingIndex])

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
                        {floorButtonList[buildingList[selectBuildingIndex]] && floorButtonList[buildingList[selectBuildingIndex]].map((buttonLabel, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    index === selectFloorIndex ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={() => changeFloor(index)}
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