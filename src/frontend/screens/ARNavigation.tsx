import React, { RefObject, useRef, useState, useEffect } from "react";
import UnityView from '@azesmway/react-native-unity';

import { NativeSyntheticEvent, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from "../components/LoadingScreen";

interface UnityMessage {
    gameObject: string;
    methodName: string;
    message: object;
}

interface UnityProps {
    unityRef: RefObject<UnityView>;
    focusedUnityView: boolean;
    toNode: any;
    onUnityMessage: (result: NativeSyntheticEvent<Readonly<{ message: string; }>>) => void;
}

enum Message {
    GO_BACK = "EXIT"
}

const Unity = ({ unityRef, focusedUnityView, toNode, onUnityMessage: onUnityMessage }: UnityProps) => {
    const sendMessageToUnity = (message: UnityMessage) => {
        if (unityRef?.current) {
            unityRef.current.postMessage(message.gameObject, message.methodName, JSON.stringify(message.message));
        }
    }
    useEffect(() => {
        if (toNode) {
            sendMessageToUnity({
                gameObject: 'ReactAPI',
                methodName: 'SetToNode',
                message: { toNode },
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
                    onUnityMessage={onUnityMessage}
                /> : null
            }
        </View>
    );
};

const ARNavigationScreen = ({ route, navigation }) => {
    const unityRef = useRef<UnityView>(null);
    const [focusedUnityView, setfocusedUnityView] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(true)
    const toNode = route.params.toNode;
    // Remount UnityView when the screen is focused
    useFocusEffect(() => {
        setfocusedUnityView(true);

        return () => {
            setfocusedUnityView(false);
        };
    });

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

    const handleUnityMessage = (result: NativeSyntheticEvent<Readonly<{ message: string; }>>) => {
        const message = result.nativeEvent.message;
        console.log(message);
        if (message in Message) {
            switch (message) {
                case Message.GO_BACK:
                    navigation.goBack();
                    break;
            }
        }
    };

    if (isLoading)
        return <LoadingScreen />;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Unity unityRef={unityRef} focusedUnityView={focusedUnityView} toNode={toNode} onUnityMessage={handleUnityMessage} />
        </GestureHandlerRootView>
    );
}

export default ARNavigationScreen;
