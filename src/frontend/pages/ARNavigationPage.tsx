import React, { useEffect, useRef } from "react";
import UnityView from '@azesmway/react-native-unity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Button, Text, View } from "react-native";

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
    // const [loading, setLoading] = React.useState(true);

    const handleExitArNavigationPage = () => {
        // setLoading(true);
        navigation.goBack();
    };
    // console.log('rerender')
    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 1000);
    // })

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* {loading ? <Text style={{ fontSize: 100 }}>loading</Text> : <Unity />} */}
            <Unity />
            <Button
                onPress={handleExitArNavigationPage}
                title="Exit AR Navigation" />
            {/* <ARTopNavigationBar latitude={22.396427} longitude={114.109497} handleExitArNavigationPage={() => navigation.goBack()} />
            <ARNavigationCamera />
            <ARBottomNavigationBar /> */}
        </GestureHandlerRootView>
    );
}

export default ARNavigationPage;
