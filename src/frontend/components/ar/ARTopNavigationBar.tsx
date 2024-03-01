import React from 'react';
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import EntypoIcon from "react-native-vector-icons/Entypo"

import { Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'

const ARTopNavigationBar = ({ latitude, longitude, handleExitArNavigationPage }: { latitude?: number, longitude?: number, handleExitArNavigationPage: () => void }) => {
    return (
        <View style={{ ...styles.overlayContainer, ...styles.topContainer, ...styles.navigationBar }}>
            <MaterialIcon
                name='turn-right'
                color='white'
                size={50} />
            <View style={styles.informationContainer}>
                <Text style={styles.directionIndicator}>Turn Right</Text>
                <Text style={styles.coordinateIndicator}>{`${latitude}, ${longitude}`}</Text>
            </View>
            <TouchableOpacity onPress={handleExitArNavigationPage} >
                <EntypoIcon
                    name="circle-with-cross"
                    color='white'
                    size={40}
                />
            </TouchableOpacity>
        </View>
    )
}

export default ARTopNavigationBar;

var styles = StyleSheet.create({
    overlayContainer: {
        zIndex: 1,
        elevation: (Platform.OS === 'android') ? 1 : 0,
    },
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    navigationBar: {
        width: '100%',
        height: '15%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center"
    },
    informationContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    directionIndicator: {
        color: 'white',
        fontSize: 40,
        fontWeight: "400"
    },
    coordinateIndicator: {
        color: 'white',
        fontSize: 12,
        fontWeight: '100'
    }
}
);
