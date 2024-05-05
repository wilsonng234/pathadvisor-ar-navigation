import React from "react";
import { View, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigator";

const EventScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Event'>) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

export default EventScreen;

