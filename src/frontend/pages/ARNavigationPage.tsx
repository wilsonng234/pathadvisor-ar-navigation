import React, { useRef } from "react";
import UnityView from '@azesmway/react-native-unity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Button, View } from "react-native";

interface UnityMessage {
    gameObject: string;
    methodName: string;
    message: object;
}

const Unity = () => {
    const unityRef = useRef<UnityView>(null);

    const sendMessageToUnity = (message: UnityMessage) => {
        if (unityRef?.current) {
            unityRef.current.postMessage(message.gameObject, message.methodName, JSON.stringify(message.message));
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <UnityView
                ref={unityRef}
                style={{ flex: 1 }}
                onUnityMessage={(result) => {
                    console.log('Message Here : ', result.nativeEvent.message)
                }}
            />

            <Button
                title="Send Message to Unity"
                onPress={() => {
                    sendMessageToUnity({
                        gameObject: 'Canvas/ReactToUnity',
                        methodName: 'GetDatas',
                        message: {
                            name: "Tom",
                            age: 25,
                        },
                    });
                }}
            />
        </View>
    );
};

const ARNavigationPage = ({ navigation }) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Unity></Unity>
            {/* <ARTopNavigationBar latitude={22.396427} longitude={114.109497} handleExitArNavigationPage={() => navigation.goBack()} />
            <ARNavigationCamera />
            <ARBottomNavigationBar /> */}
        </GestureHandlerRootView>
    );
}

export default ARNavigationPage;
