import React from "react";
import MapView from "../MapView";
import { View, StyleSheet, Dimensions } from "react-native";

const PathAdvisorPage = ({ navigation }) => {
    return (
        <>
            <MapView />
            <View style={styles.mapDrawerOverlay} />
        </>
    );
}

export default PathAdvisorPage;

const styles = StyleSheet.create({
    mapDrawerOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.0,
        height: Dimensions.get('window').height,
        width: '5%',
    }
});

