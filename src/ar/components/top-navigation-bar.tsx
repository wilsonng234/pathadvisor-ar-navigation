import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const TopNavigationBar = ({ longitude, latitude }: { longitude?: number, latitude?: number, }) => {
    return (
        <View style={{ ...styles.overlayContainer, ...styles.topContainer, ...styles.navigationBar }}>
            <View style={styles.informationContainer}>
                <Text style={styles.directionIndicator}>Turn Right</Text>
                <Text style={styles.coordinateIndicator}>{`${longitude}, ${latitude}`}</Text>
            </View>
        </View>
    )
}

export default TopNavigationBar;

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center",
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

