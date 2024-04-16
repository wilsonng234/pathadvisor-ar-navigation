import React, { useState } from "react";
import axios from "axios";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Text, View } from "react-native";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { useFocusEffect } from "@react-navigation/native";

const BusQueueStatisticsScreen = () => {
    const [time, setTime] = useState<string>("");
    const [northPeople, setNorthPeople] = useState(0);
    const [northTime, setNorthTime] = useState(0);
    const [southPeople, setSouthPeople] = useState(0);
    const [southTime, setSouthTime] = useState(0);

    useFocusEffect(() => {
        // Fetch current time
        getTime();
        const fetchTime = setInterval(() => {
            getTime();
        }, 1000);

        // Fetch bus queue statistics
        getBusQueueStatistics();
        const fetchStat = setInterval(() => {
            getBusQueueStatistics();

        }, 10000);

        return () => {
            clearInterval(fetchTime);
            clearInterval(fetchStat);
        }
    });

    const getTime = () => {
        const addZero = (date: number) => ("0" + date).slice(-2);

        const today = new Date();
        const date = today.getFullYear() + '-' + addZero(today.getMonth() + 1) + '-' + addZero(today.getDate());
        const time = addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + ":" + addZero(today.getSeconds());
        const dateTime = date + ' ' + time;

        setTime(dateTime);
    }

    const getBusQueueStatistics = () => {
        axios.get('https://eek123.ust.hk/BusQueue/clientAPI/busqueue')
            .then(
                response => {
                    setNorthPeople(response.data[response.data.length - 1]["north_count"]);
                    setNorthTime(response.data[response.data.length - 1]["north_waiting"]);
                    setSouthPeople(response.data[response.data.length - 1]["south_count"]);
                    setSouthTime(response.data[response.data.length - 1]["south_waiting"]);
                }
            )
            .catch(e => console.error(e));
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {/* North Bus Stop */}
                <View style={styles.infoBox}>
                    <Text style={styles.stop}>North Bus Stop</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome
                            name="users"
                            style={styles.infoUsers}
                        />
                        <Text style={styles.infoText}>{northPeople}</Text>

                        <View style={styles.infoDivider} />

                        <FontAwesome
                            name="clock-o"
                            style={styles.infoClock}
                        />
                        <Text style={styles.infoText}>{Math.floor(northTime / 60)}m{northTime % 60}s</Text>
                    </View>
                </View>
                <WebView
                    style={styles.live}
                    source={{ uri: 'https://pathadvisor.ust.hk/liveview/liveview-north.html' }}
                    allowsFullscreenVideo={true}
                />

                {/* South Bus Stop */}
                <View style={styles.infoBox}>
                    <Text style={styles.stop}>South Bus Stop</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome
                            name="users"
                            style={styles.infoUsers}
                        />
                        <Text style={styles.infoText}>{southPeople}</Text>

                        <View style={styles.infoDivider} />

                        <FontAwesome
                            name="clock-o"
                            style={styles.infoClock}
                        />
                        <Text style={styles.infoText}>{Math.floor(southTime / 60)}m{southTime % 60}s</Text>
                    </View>
                </View>
                <WebView
                    style={styles.live}
                    source={{ uri: 'https://pathadvisor.ust.hk/liveview/liveview-south.html' }}
                    allowsFullscreenVideo={true}
                />

                <View style={styles.timerBox}>
                    <Text style={styles.timerText}>{time}</Text>
                </View>

                <View style={styles.reminderBox}>
                    <View style={styles.reminderRow}>
                        <FontAwesome
                            name="users"
                            style={[styles.infoUsers, styles.reminderIcon]}
                        />
                        <Text style={styles.reminderText}>means the estimated number of people waiting</Text>
                    </View>

                    <View style={styles.reminderRow}>
                        <FontAwesome
                            name="clock-o"
                            style={[styles.infoClock, styles.reminderIcon]}
                        />
                        <Text style={styles.reminderText}>means estimated waiting time</Text>
                    </View>
                </View>

                <View style={styles.footerBox}>
                    <Text style={styles.footerText}>
                        The bus queue statistics feature is an add-on feature that was developed by a UST team "smartap".
                        If you have any questions, please contact smartap@cse.ust.hk
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

export default BusQueueStatisticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    live: {
        flex: 1,
        width: Dimensions.get("screen").width,
        aspectRatio: 1.8
    },

    infoBox: {
        width: 250,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        margin: 16,
        alignItems: 'center',
    },

    stop: {
        fontSize: 20,
        color: 'black',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },

    infoDivider: {
        width: 25
    },

    infoText: {
        color: 'black',
        fontSize: 20,
        marginHorizontal: 4,
    },

    infoUsers: {
        color: '#6bd4c8',
        fontSize: 30
    },

    infoClock: {
        color: '#57aed3',
        fontSize: 30
    },

    timerBox: {
        marginTop: 15
    },

    timerText: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400'
    },

    reminderBox: {
        alignItems: 'center',
        marginTop: 20
    },

    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    reminderIcon: {
        fontSize: 18,
        marginRight: 5,
    },

    reminderText: {
        fontSize: 14,
        color: 'black',
        fontWeight: '400'
    },

    footerBox: {
        width: '80%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15
    },

    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#A9A9A9',
        marginBottom: 15
    },
});
