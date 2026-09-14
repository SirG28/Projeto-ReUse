import React from "react";
import { Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import AnimatedPressable from "./AnimatedPressable";

type SecondaryButtonProps = {
    title: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

export default function SecondaryButton({
    title,
    onPress,
    style,
}: SecondaryButtonProps) {
    return (
        <AnimatedPressable style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({

    /* Wrapper do botão: empurra pra baixo */ 
    buttonArea: { 
        marginTop: "auto", 
        paddingBottom: 24, 
    },
    
    button: {
        borderWidth: 1,
        borderColor: "#639922",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
    },

    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#639922",
    },
});