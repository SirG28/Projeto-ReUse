import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function HeaderHome() {
    const [pontos, setPontos] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            async function carregarPontos() {
                try {
                    const pontosSalvos = await AsyncStorage.getItem("@reuse_pontos");
                    setPontos(pontosSalvos ? parseInt(pontosSalvos) : 0);
                } catch (error) {
                    console.log("Erro ao carregar pontos:", error);
                }
            }
            carregarPontos();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                <Text style={styles.logoRe}>Re</Text>
                <Text style={styles.logoUse}>Use</Text>
                <Text style={styles.logoBang}>!</Text>
            </Text>

            <View style={styles.xpBadge}>
                <Text style={styles.xpText}>★ {pontos} XP</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 14,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: "#F7F9F5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: -0.3,
    },

    logoRe: {
        color: "#2F2F2F",
    },

    logoUse: {
        color: "#7AA61C",
    },

    logoBang: {
        color: "#639922",
    },

    xpBadge: {
        borderWidth: 1,
        borderColor: "#7AA61C",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#EEF7DC",
    },

    xpText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#7AA61C",
    },
});