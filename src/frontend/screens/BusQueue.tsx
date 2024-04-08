import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View } from "react-native";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';

const BusQueueScreen = () => {
    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <WebView style={styles.live} source={{ uri: 'https://pathadvisor.ust.hk/liveview/liveview-north.html' }} />
                <WebView style={styles.live} source={{ uri: 'https://pathadvisor.ust.hk/liveview/liveview-south.html' }} />

                <View style={styles.reminderBox}>
                    <Text style={styles.reminderText}>
                        The bus queue statistics feature is an add-on feature that was developed by a UST team "smartap".
                        If you have any questions, please contact smartap@cse.ust.hk
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

export default BusQueueScreen;

const styles = StyleSheet.create({
    container: {

    },

    live: {
        flex: 1,
        width: Dimensions.get("screen").width,
        aspectRatio: 1.8,
        marginBottom: 15
    },

    reminderBox: {
        width: '80%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15
    },

    reminderText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#A9A9A9',
        marginBottom: 15
    },
});
