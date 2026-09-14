import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const ReanimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
};

export default function AnimatedPressable({
    style,
    scaleTo = 0.97,
    onPressIn,
    onPressOut,
    ...rest
}: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <ReanimatedPressable
            style={[style, animatedStyle]}
            onPressIn={(e) => {
                scale.value = withTiming(scaleTo, { duration: 100 });
                onPressIn?.(e);
            }}
            onPressOut={(e) => {
                scale.value = withTiming(1, { duration: 120 });
                onPressOut?.(e);
            }}
            {...rest}
        />
    );
}
