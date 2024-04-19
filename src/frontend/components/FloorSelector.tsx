import React, { useEffect, useState, useRef, memo } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';

import useGetBuildings from '../hooks/api/useGetBuildings';
import useGetFloors from '../hooks/api/useGetFloors';

interface FloorSelectorProps {
    handleSelectorChangeFloor: (id: string) => void;
}

type FloorsButtonsDict = { [buildingId: string]: string[] }

const FloorSelector = ({ handleSelectorChangeFloor }: FloorSelectorProps) => {
    const { data: buildings, isLoading: isLoadingBuildings } = useGetBuildings();
    const { data: floors, isLoading: isLoadingFloors } = useGetFloors();

    const [floorButtonDict, setFloorButtonDict] = useState<FloorsButtonsDict>({});
    const [buildingList, setBuildingList] = useState<string[]>([]);
    const [buildingButtons, setBuildingButtons] = useState<string[]>([]);
    const [selectFloorIndex, setSelectFloorIndex] = useState(6);
    const [selectBuildingIndex, setSelectBuildingIndex] = useState(0);

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (floors === undefined)
            return;

        const tempFloorButtonList: FloorsButtonsDict = {};
        const tempBuildingList: string[] = [];

        Object.keys(floors).forEach(floorId => {
            if (tempFloorButtonList[floors[floorId].buildingId] === undefined)
                tempFloorButtonList[floors[floorId].buildingId] = [];

            tempFloorButtonList[floors[floorId].buildingId].push(floorId);
        });

        Object.keys(tempFloorButtonList).forEach(building => {
            tempFloorButtonList[building].sort((a, b) => {
                if (floors[a].rank > floors[b].rank) return 1;
                else return -1;
            })

            tempBuildingList.push(building);
        });

        buildingList.sort();
        setFloorButtonDict(tempFloorButtonList);
        setBuildingList(tempBuildingList);

    }, [floors])

    useEffect(() => {
        if (buildings === undefined)
            return;

        setBuildingButtons(buildingList.map(building => buildings[building].name));
    }, [buildings, buildingList])

    const changeFloor = (floorIndex: number) => {
        if (Object.keys(floorButtonDict).length === 0)
            return;
        if (buildingList.length === 0)
            return;

        handleSelectorChangeFloor(floorButtonDict[buildingList[selectBuildingIndex]][floorIndex])
        setSelectFloorIndex(floorIndex)
    }

    const changeBuilding = (buildingIndex: number) => {
        setSelectBuildingIndex(buildingIndex);
        changeFloor(buildingIndex === 0 ? 6 : 0);

        scrollOffset();
    }

    const scrollOffset = () => {
        if (selectBuildingIndex === 0)
            scrollViewRef.current?.scrollTo({ x: 230, y: 0, animated: true });
        else
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }

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
                        {buildingButtons.map((buttonLabel, buildingIndex) => (
                            <TouchableOpacity
                                key={buildingIndex}
                                style={[
                                    styles.button,
                                    buildingIndex === selectBuildingIndex ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={() => changeBuilding(buildingIndex)}
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
                        {floorButtonDict[buildingList[selectBuildingIndex]] && floorButtonDict[buildingList[selectBuildingIndex]].map((buttonLabel, floorIndex) => (
                            <TouchableOpacity
                                key={floorIndex}
                                style={[
                                    styles.button,
                                    floorIndex === selectFloorIndex ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={() => changeFloor(floorIndex)}
                            >
                                <Text style={styles.buttonText}>{buttonLabel}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
}

export default memo(FloorSelector);

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