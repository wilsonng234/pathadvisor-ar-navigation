import React, { useEffect, useState } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Text, View } from "react-native";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import axios from "axios";

const BusQueueScreen = () => {
    const [northPeople, setNorthPeople] = useState(0);
    const [northTime, setNorthTime] = useState(0);
    const [southPeople, setSouthPeople] = useState(0);
    const [southTime, setSouthTime] = useState(0);
    const getStat = () => {
        axios.get('https://eek123.ust.hk/BusQueue/clientAPI/busqueue')
            .then(
                response => {
                    setNorthPeople(response.data[response.data.length - 1]["north_count"]);
                    setNorthTime(response.data[response.data.length - 1]["north_waiting"]);
                    setSouthPeople(response.data[response.data.length - 1]["south_count"]);
                    setSouthTime(response.data[response.data.length - 1]["south_waiting"]);
                    console.log(response.data[response.data.length - 1]["south_count"])
                }
            )
            .catch(e => console.log(e));
    }

    useEffect(() => {
        getStat();
    }, []);

    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.container}>
                    <Text style={styles.title}>North Bus Stop</Text>
                    <View style={styles.infoContainer}>
                        <SimpleLineIcons
                            name="people"
                            color="black"
                            style={{ marginLeft: 8 }}   // move icon to the center
                            size={20} />
                        <Text style={styles.infoText}>{northPeople}</Text>
                        <MaterialIcons
                            name="access-time"
                            color="black"
                            style={{ marginLeft: 8 }}   // move icon to the center
                            size={20} />
                        <Text style={styles.infoText}>{Math.floor(northTime/60)}m{northTime%60}s</Text>
                    </View>
                </View>
                <WebView style={styles.live} source={{ uri: 'https://pathadvisor.ust.hk/liveview/liveview-north.html' }} />
                <View style={styles.container}>
                    <Text style={styles.title}>South Bus Stop</Text>
                    <View style={styles.infoContainer}>
                        <SimpleLineIcons
                            name="people"
                            color="black"
                            style={{ marginLeft: 8 }}   // move icon to the center
                            size={20} />
                        <Text style={styles.infoText}>{southPeople}</Text>
                        <MaterialIcons
                            name="access-time"
                            color="black"
                            style={{ marginLeft: 8 }}   // move icon to the center
                            size={20} />
                        <Text style={styles.infoText}>{Math.floor(southTime/60)}m{southTime%60}s</Text>
                    </View>
                </View>
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
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        margin: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 18,
        marginHorizontal: 4,
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
