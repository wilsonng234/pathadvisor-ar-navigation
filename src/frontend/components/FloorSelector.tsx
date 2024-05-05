import React, { useEffect, useState, useRef, memo } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';

import useHomeStore from '../hooks/store/useHomeStore';
import { BuildingsDict, FloorsDict } from 'frontend/utils/storage_utils';

interface FloorSelectorProps {
    currentFloorId: string;
    handleSelectorChangeFloor: (id: string) => void;
}

type ButtonsDict = { [buildingId: string]: string[] }

const FloorSelector = ({ currentFloorId, handleSelectorChangeFloor }: FloorSelectorProps) => {
    const { buildings, floors } = useHomeStore();
    const floorScrollViewRef = useRef<ScrollView>(null);

    const [buttons, setButtons] = useState<ButtonsDict | undefined>(undefined);

    useEffect(() => {
        if (buildings && floors) {
            const tempButtons: { [buildingId: string]: string[] } = {};

            Object.keys(floors).forEach(floorId => {
                const buildingId = floors[floorId].buildingId;

                if (tempButtons[buildingId] === undefined)
                    tempButtons[buildingId] = [];

                tempButtons[buildingId].push(floorId);
            });

            for (const buildingId in tempButtons)
                tempButtons[buildingId].sort((a, b) => floors[a].rank > floors[b].rank ? 1 : -1);

            setButtons(tempButtons);
        }

    }, [buildings, floors])

    const handleFloorButtonsChanged = (floors: FloorsDict) => {
        if (floors[currentFloorId].buildingId === 'academicBuilding') {
            floorScrollViewRef.current?.scrollTo({ x: 230, y: 0, animated: true });
        }
        else {
            floorScrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }

    const handleSelectBuilding = (buttons: ButtonsDict, buildingId: string) => {
        if (buildingId === 'academicBuilding')
            handleSelectorChangeFloor(buttons[buildingId][6]);
        else
            handleSelectorChangeFloor(buttons[buildingId][0]);
    }

    const handleSelectFloor = (floorId: string) => {
        handleSelectorChangeFloor(floorId);
    }

    const renderBuildingButtons = (floors: FloorsDict, buildings: BuildingsDict, buttons: ButtonsDict) => {
        const buildingButtons = Object.keys(buttons).sort();

        return (
            <View style={styles.buttonGroupContainer}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    {
                        buildingButtons.map((buildingId, buildingIndex) => (
                            <TouchableOpacity
                                key={buildingIndex}
                                style={[styles.button, buildingId === floors[currentFloorId].buildingId ? styles.activeButton : styles.inactiveButton]}
                                onPress={() => handleSelectBuilding(buttons, buildingId)}
                            >
                                <Text style={styles.buttonText}>{buildings[buildingId].name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
        )
    };

    const renderFloorButtons = (floors: FloorsDict, buttons: ButtonsDict, buildingId: string) => {
        const floorButtons = buttons[buildingId];

        return (
            <View style={styles.buttonGroupContainer}>
                <ScrollView
                    ref={floorScrollViewRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    onContentSizeChange={() => handleFloorButtonsChanged(floors)}
                >
                    {
                        floorButtons.map((floorId, floorIndex) => {
                            return (
                                <TouchableOpacity
                                    key={floorIndex}
                                    style={[styles.button, floorId === currentFloorId ? styles.activeButton : styles.inactiveButton]}
                                    onPress={() => handleSelectFloor(floorId)}
                                >
                                    <Text style={styles.buttonText}>{floors[floorId].name ? floors[floorId].name : floorId}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }

    if (!floors || !buildings || !buttons)
        return <></>;
    else
        return (
            <View style={{ marginBottom: 20 }}>
                {renderBuildingButtons(floors, buildings, buttons)}
                {renderFloorButtons(floors, buttons, floors[currentFloorId].buildingId)}
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