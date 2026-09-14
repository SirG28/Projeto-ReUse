import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
    actionText?: string;
};

export default function SectionHeader({ title, actionText }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            {actionText ? (
                <Pressable>
                    <Text style={styles.action}>{actionText} ›</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2F2F2F",
    },

    action: {
        fontSize: 13,
        color: "#7AA61C",
        fontWeight: "600",
    },
});