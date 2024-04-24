import React, { RefObject, useRef, useState, useEffect } from "react";
import UnityView from '@azesmway/react-native-unity';
import { NativeSyntheticEvent, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import LoadingScreen from "../components/LoadingScreen";
import Node from "../../backend/schema/node";
import { RootStackParamList } from "../Navigator";

interface UnityMessage {
    gameObject: string;
    methodName: string;
    message: object;
}

interface UnityProps {
    unityRef: RefObject<UnityView>;
    toNode: Node;
    focusedUnityView: boolean;
    unityStarted: boolean;
    onUnityMessage: (result: NativeSyntheticEvent<Readonly<{ message: string; }>>) => void;
}

enum Message {
    START = "START",
    EXIT = "EXIT"
}

const Unity = ({ unityRef, toNode, focusedUnityView, unityStarted, onUnityMessage }: UnityProps) => {
    const sendMessageToUnity = (message: UnityMessage) => {
        if (unityRef?.current) {
            unityRef.current.postMessage(message.gameObject, message.methodName, JSON.stringify(message.message));
            console.log("Message sent to Unity: ", message.message);
        }
    }

    useEffect(() => {
        // avoid sending message to Unity before UnityView is started
        if (unityStarted && toNode) {
            sendMessageToUnity({
                gameObject: 'ReactAPI',
                methodName: 'SetToNode',
                message: { toNode },
            });
        }
    }, [unityStarted]);

    useEffect(() => {
        sendMessageToUnity({
            gameObject: 'ReactAPI',
            methodName: 'SendStart',
            message: { message: Message.START },
        });
    }, []);


    return (
        <View style={{ flex: 1 }}>
            {
                // Remount UnityView when the screen is focused
                // Otherwise, the UnityView becomes black or white screen

                focusedUnityView ? <UnityView
                    ref={unityRef}
                    style={{ flex: 1 }}
                    onUnityMessage={onUnityMessage}
                /> : <></>
            }
        </View>
    );
};

const ARNavigationScreen = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'AR Navigation'>) => {
    const unityRef = useRef<UnityView>(null);
    const [focusedUnityView, setfocusedUnityView] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [unityStarted, setUnityStarted] = useState<boolean>(false);
    const toNode = route.params.toNode;



    // Remount UnityView when the screen is focused
    useFocusEffect(() => {
        setfocusedUnityView(true);

        return () => {
            setUnityStarted(false);
            setfocusedUnityView(false);
        };
    });

    const handleUnityMessage = (result: NativeSyntheticEvent<Readonly<{ message: string; }>>) => {
        let message = result.nativeEvent.message;
        console.log("Unity message: ", message)

        if (message in Message) {
            switch (message) {
                case Message.START:
                    setIsLoading(false)
                    setUnityStarted(true);
                    break;
                case Message.EXIT:
                    setUnityStarted(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    })
                    break;
            }
        }
    };

    return (
        // <LoadingScreen />
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Unity
                unityRef={unityRef}
                toNode={toNode}
                focusedUnityView={focusedUnityView}
                unityStarted={unityStarted}
                onUnityMessage={handleUnityMessage}
            />
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <LoadingScreen />
                </View>
            )}
        </GestureHandlerRootView>
    )
}

export default ARNavigationScreen;

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    }
});