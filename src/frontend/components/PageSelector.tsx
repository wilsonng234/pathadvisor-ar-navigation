import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { UseQueryResult } from '@tanstack/react-query';
import { BuildingsDict, FloorsDict, useBuildingsQuery, useFloorsQuery } from '../utils/reactQueryFactory';

interface PageSelectorProps {
    currentFloorID: string;
    currentBuildingID: string;
    handleSelectorChangeFloor: (id: string) => void;
}

const PageSelector = ({ currentFloorID, currentBuildingID, handleSelectorChangeFloor }: PageSelectorProps) => {
    const { data: buildings, isLoading: isLoadingBuildings }: UseQueryResult<BuildingsDict> = useBuildingsQuery()
    const { data: floors, isLoading: isLoadingFloors }: UseQueryResult<FloorsDict> = useFloorsQuery()
    const [buttons, setButtons] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(5);

    const changeFloor = (index: number, setCurrentFloorId: (id: string) => void) => {
        setSelectedIndex(index)
        setCurrentFloorId(buttons[index])
        console.log(floors);
    }
    useEffect(() => {
        if (floors === undefined) return;
        Object.keys(floors).forEach(element => {
            if (floors[element].buildingId === currentBuildingID) {
                buttons.push(element)
            }
        });
    })

    useEffect(() => {
        setButtons(buttons)
    }, [])

    if (isLoadingBuildings || isLoadingFloors)
        return <View></View>;
    else
        return (
            <View style={styles.buttonGroupContainer}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    contentOffset={{ x: 230, y: 0 }}
                >
                    {buttons.map((buttonLabel, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.button,
                                index === selectedIndex ? styles.activeButton : styles.inactiveButton,
                            ]}
                            onPress={() => changeFloor(index, handleSelectorChangeFloor)}
                        >
                            <Text style={styles.buttonText}>{buttonLabel}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
}

export default PageSelector;

const styles = StyleSheet.create({
    buttonGroupContainer: {
        marginBottom: 30,
        height: 50,
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