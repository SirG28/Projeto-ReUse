import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AnimatedPressable from "../ui/AnimatedPressable";

type Props = {
    title: string;
    xp: string;
    icon: string;
    onPress?: () => void;
};

export default function ShortcutCard({ title, xp, icon, onPress }: Props) {
    return (
        <AnimatedPressable style={styles.card} onPress={onPress}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}>{icon}</Text>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.xp}>{xp}</Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 118,
        minHeight: 106,
        backgroundColor: "#FBFBFA",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D9D4CB",
        padding: 12,
        justifyContent: "space-between",
    },

    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F1F1EE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    icon: {
        fontSize: 16,
        color: "#7AA61C",
        fontWeight: "700",
    },

    title: {
        fontSize: 13,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 4,
    },

    xp: {
        fontSize: 12,
        color: "#3F3F3F",
    },
});