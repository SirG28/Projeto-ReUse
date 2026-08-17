import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export default function UserSummaryCard() {
    const [totalItens, setTotalItens] = useState(0);
    const router = useRouter();
    const [pontos, setPontos] = useState(0);

    const progressPct = Math.min((pontos / 1500) * 100, 100);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(progressPct, { duration: 600 });
    }, [progressPct, progress]);

    const animatedFillStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    useFocusEffect(
        React.useCallback(() => {
            async function carregarItens() {
                try {
                    const itensSalvos = await AsyncStorage.getItem("@reuse_itens");
                    const itens = itensSalvos ? JSON.parse(itensSalvos) : [];
                    setTotalItens(itens.length);

                    const pontosSalvos = await AsyncStorage.getItem("@reuse_pontos");
                    setPontos(pontosSalvos ? parseInt(pontosSalvos) : 0);
                } catch (error) {
                    console.log("Erro ao carregar itens:", error);
                }
            }
            carregarItens();
        }, [])
    );

    return (
  <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.avatarArea}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarIcon}>◔</Text>
                    </View>
                    <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                    </View>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.welcome}>Boas-vindas, Usuário</Text>
                    <Text style={styles.level}>Nível 1</Text>
                </View>
            </View>

            <View style={styles.progressArea}>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressText}>{pontos} / 1.500 para o Nível 2</Text>
                    <Text style={styles.progressText}>{Math.min(Math.round((pontos / 1500) * 100), 100)}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <Animated.View style={[styles.progressBarFill, animatedFillStyle]} />
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Trocas</Text>
                </View>

                {/* Itens — clicável, vai para Meus Itens */}
                <Pressable style={styles.statCard} onPress={() => router.push("/myItems")}>
                    <Text style={styles.statNumber}>{totalItens}</Text>
                    <Text style={styles.statLabel}>Itens</Text>
                </Pressable>

                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Avaliação</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FBFBFA",
        borderRadius: 16,
        padding: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#ECE9E2",
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    avatarArea: {
        position: "relative",
        marginRight: 10,
    },

    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#F0F3E8",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarIcon: {
        fontSize: 18,
        color: "#7AA61C",
    },

    checkBadge: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#E9DDFB",
        alignItems: "center",
        justifyContent: "center",
    },

    checkText: {
        fontSize: 10,
        color: "#7A53C6",
        fontWeight: "700",
    },

    userInfo: {
        flex: 1,
    },

    welcome: {
        fontSize: 14,
        color: "#3B3B3B",
        fontWeight: "500",
    },

    level: {
        fontSize: 12,
        color: "#6E6E6E",
        marginTop: 2,
    },

    progressArea: {
        marginBottom: 14,
    },

    progressLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    progressText: {
        fontSize: 12,
        color: "#3B3B3B",
    },

    progressBarBackground: {
        height: 6,
        backgroundColor: "#E6E6E6",
        borderRadius: 999,
        overflow: "hidden",
    },

    progressBarFill: {
        height: "100%",
        backgroundColor: "#7AA61C",
        borderRadius: 999,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#F2F0EC",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD7CC",
    },

    statNumber: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 4,
    },

    statLabel: {
        fontSize: 12,
        color: "#3F3F3F",
    },
});