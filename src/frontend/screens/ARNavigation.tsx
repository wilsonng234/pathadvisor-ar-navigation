import React, { RefObject, useRef, useState, useEffect } from "react";
import UnityView from '@azesmway/react-native-unity';

import { Button, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

interface UnityMessage {
    gameObject: string;
    methodName: string;
    message: object;
}

const Unity = ({ unityRef, focusedUnityView, toNode }: { unityRef: RefObject<UnityView>, focusedUnityView: boolean, toNode:any }) => {
    const sendMessageToUnity = (message: UnityMessage) => {
        if (unityRef?.current) {
            unityRef.current.postMessage(message.gameObject, message.methodName, JSON.stringify(message.message));
        }
    }
    useEffect(() => {
        if (toNode) {
            sendMessageToUnity({
                gameObject: 'ReactAPI',
                methodName: 'setToNode',
                message: {toNode},
            });
        }
    }, [toNode]);

    return (
        <View style={{ flex: 1 }}>
            {
                // Remount UnityView when the screen is focused
                focusedUnityView ? <UnityView
                    ref={unityRef}
                    style={{ flex: 1 }}
                    onUnityMessage={(result) => {
                        console.log('Message Here : ', result.nativeEvent.message)
                    }}
                /> : null
            }

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

const ARNavigationScreen = ({route, navigation }) => {
    const unityRef = useRef<UnityView>(null);
    const [focusedUnityView, setfocusedUnityView] = useState<boolean>(true);
    const toNode = route.params.toNode;
    // Remount UnityView when the screen is focused
    useFocusEffect(() => {
        setfocusedUnityView(true);

        return () => {
            setfocusedUnityView(false);
        };
    });

    const handleExitARNavigationScreen = () => {
        navigation.goBack();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Unity unityRef={unityRef} focusedUnityView={focusedUnityView}  toNode={toNode}/>
            <Button title="Exit AR Navigation" onPress={handleExitARNavigationScreen} />
        </GestureHandlerRootView>
    );
}

export default ARNavigationScreen;
