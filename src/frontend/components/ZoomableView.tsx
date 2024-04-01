import React, { Ref, forwardRef, useImperativeHandle } from 'react';
import Animated from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { transformOrigin } from 'react-native-redash';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';

interface ZoomableViewBackgroundProps {
    children?: React.ReactNode;
}

export type ZoomableViewRef = {
    translate: (translateX: number, translateY: number) => void;
}

const ZoomableView = ({ children }: ZoomableViewBackgroundProps, ref: Ref<ZoomableViewRef>) => {
    const CENTER_X = Dimensions.get('window').width / 2;
    const CENTER_Y = (Dimensions.get('window').height - useHeaderHeight()) / 2;

    const prevX = useSharedValue(0);
    const prevY = useSharedValue(0);
    const currentX = useSharedValue(0);
    const currentY = useSharedValue(0);

    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);

    const minScale = 0.5;
    const maxScale = 2;
    const scaleRatio = 0.15;
    const translationRatio = 1.5;

    const translate = (translateX: number, translateY: number) => {
        currentX.value = prevX.value = translateX;
        currentY.value = prevY.value = translateY;
    }

    useImperativeHandle(ref, () => ({ translate }))

    const panGesture = Gesture.Pan()
        .onChange((e) => {
            currentX.value = prevX.value + e.translationX * translationRatio;
            currentY.value = prevY.value + e.translationY * translationRatio;
        })
        .onEnd((e) => {
            currentX.value = prevX.value = prevX.value + e.translationX * translationRatio;
            currentY.value = prevY.value = prevY.value + e.translationY * translationRatio;
        })

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            if (e.numberOfPointers === 2) {
                focalX.value = e.focalX;
                focalY.value = e.focalY;

                const prevScale = scale.value;
                const newScale = prevScale * e.scale;
                scale.value = Math.max(minScale, Math.min(prevScale + (newScale - prevScale) * scaleRatio, maxScale));
            }
        });


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: currentX.value },
            { translateY: currentY.value },
            ...transformOrigin(
                { x: -CENTER_X + focalX.value, y: -CENTER_Y + focalY.value },
                [{ scale: scale.value }]
            )]
    }));

    return (
        <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}

export default forwardRef<ZoomableViewRef, ZoomableViewBackgroundProps>(ZoomableView);
