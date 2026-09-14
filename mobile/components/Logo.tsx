import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
    markSize?: number;
    wordmarkSize?: number;
    style?: StyleProp<ViewStyle>;
};

export default function Logo({ markSize = 34, wordmarkSize = 24, style }: Props) {
    return (
        <View style={[styles.row, style]}>
            <Svg width={markSize} height={markSize} viewBox="0 0 100 100">
                <Path
                    d="M 44.18,17.01 A 33.5,33.5 0 0 1 79.01,66.75 L 85.51,70.5 L 69.25,72.66 L 62.99,57.5 L 69.49,61.25 A 22.5,22.5 0 0 0 46.09,27.84 A 5.5,5.5 0 0 1 44.18,17.01 Z"
                    fill="#7AA61C"
                />
                <Path
                    d="M 55.82,82.99 A 33.5,33.5 0 0 1 20.99,33.25 L 14.49,29.5 L 30.75,27.34 L 37.01,42.5 L 30.51,38.75 A 22.5,22.5 0 0 0 53.91,72.16 A 5.5,5.5 0 0 1 55.82,82.99 Z"
                    fill="#639922"
                />
            </Svg>
            <Text style={[styles.wordmark, { fontSize: wordmarkSize }]}>
                <Text style={styles.re}>Re</Text>
                <Text style={styles.use}>Use</Text>
                <Text style={styles.bang}>!</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 10 },
    wordmark: { fontWeight: "800", letterSpacing: -0.3 },
    re: { color: "#2F2F2F" },
    use: { color: "#7AA61C" },
    bang: { color: "#639922" },
});
