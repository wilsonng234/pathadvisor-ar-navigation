import React from 'react';
import Animated from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


interface ZoomableViewBackgroundProps {
    children?: React.ReactNode;
}

const ZoomableView = ({ children }: ZoomableViewBackgroundProps) => {
    const prevX = useSharedValue(0);
    const prevY = useSharedValue(0);
    const currentX = useSharedValue(0);
    const currentY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onChange((e) => {
            currentX.value = prevX.value + e.translationX;
            currentY.value = prevY.value + e.translationY;
        })
        .onEnd((e) => {
            currentX.value = prevX.value + e.translationX;
            currentY.value = prevY.value + e.translationY;

            prevX.value = currentX.value;
            prevY.value = currentY.value;
        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: currentX.value },
            { translateY: currentY.value },
        ]
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}

export default ZoomableView;
