import React, { useEffect, useRef } from "react";
import UnityView from '@azesmway/react-native-unity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ARTopNavigationBar from '../components/ar/ARTopNavigationBar';
import ARBottomNavigationBar from '../components/ar/ARBottomNavigationBar';
import ARNavigationCamera from '../components/ar/ARNavigationCamera';
import { View } from "react-native";

interface IMessage {
    gameObject: string;
    methodName: string;
    message: string;
}

const Unity = () => {
    const unityRef = useRef<UnityView>(null);

    useEffect(() => {
        if (unityRef?.current) {
            const message: IMessage = {
                gameObject: 'gameObject',
                methodName: 'methodName',
                message: 'message',
            };
            unityRef.current.postMessage(message.gameObject, message.methodName, message.message);
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <UnityView
                ref={unityRef}
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    top: 1,
                    bottom: 1
                }}
                onUnityMessage={(result) => {
                    console.log('Message Here : ', result.nativeEvent.message)
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
