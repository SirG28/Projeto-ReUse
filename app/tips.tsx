// app/tips.tsx
import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    ActivityIndicator,
    Linking,
    Alert,
    RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { getNews, Article } from "../services/newsService";
import { clearCache } from "../services/cacheService";
import BottomNav from "../components/home/BottomNav";
import OfflineBanner from "../components/OfflineBanner";

export default function TipsScreen() {
    const router = useRouter();
    const [artigos, setArtigos] = useState<Article[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        carregarNoticias();
    }, []);

    async function carregarNoticias() {
        try {
            setErro(null);
            const data = await getNews();
            setArtigos(data);
        } catch {
            setErro("Não foi possível carregar as dicas. Verifique sua conexão.");
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }

    async function onRefresh() {
        setAtualizando(true);
        await clearCache("@cache_news");
        await carregarNoticias();
    }

    async function abrirArtigo(url: string) {
        try {
            await Linking.openURL(url);
        } catch {
            setErro(
                "Não foi possível carregar os itens. Verifique sua conexão."
            );
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Animated.View style={{ flex: 1 }} entering={FadeInDown.duration(220)}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backIcon}>‹</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Dicas Sustentáveis</Text>
                <View style={styles.backBtn} />
            </View>

            <OfflineBanner />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={onRefresh}
                        tintColor="#7AA61C"
                    />
                }
            >
                {carregando ? (
                    <ActivityIndicator
                        size="large"
                        color="#7AA61C"
                        style={{ marginTop: 40 }}
                    />
                ) : erro ? (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>{erro}</Text>
                    </View>
                ) : artigos.length === 0 ? (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>
                            Nenhuma dica disponível.
                        </Text>
                    </View>
                ) : (
                    artigos.map((artigo, idx) => (
                        <Animated.View
                            key={idx}
                            entering={FadeInUp.delay(Math.min(idx, 8) * 50).duration(300)}
                        >
                            <Pressable
                                style={styles.card}
                                onPress={() => abrirArtigo(artigo.url)}
                            >
                                {artigo.image ? (
                                    <Image
                                        source={{ uri: artigo.image }}
                                        style={styles.cardImage}
                                    />
                                ) : null}
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardSource}>
                                        {artigo.source?.name}
                                    </Text>
                                    <Text style={styles.cardTitle} numberOfLines={2}>
                                        {artigo.title}
                                    </Text>
                                    <Text
                                        style={styles.cardDescription}
                                        numberOfLines={3}
                                    >
                                        {artigo.description}
                                    </Text>
                                    <Text style={styles.cardLink}>Ler mais →</Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    ))
                )}
            </ScrollView>
            </Animated.View>

            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F5" },
    header: {
        height: 56,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5E5",
    },
    backBtn: { width: 32, alignItems: "center", justifyContent: "center" },
    backIcon: { fontSize: 28, color: "#7AA61C", lineHeight: 32 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
    content: { padding: 16, paddingBottom: 110 },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E6E2D9",
        overflow: "hidden",
        marginBottom: 12,
    },
    cardImage: {
        width: "100%",
        height: 160,
        backgroundColor: "#EEE",
    },
    cardContent: { padding: 14 },
    cardSource: {
        fontSize: 11,
        color: "#7AA61C",
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 6,
        lineHeight: 20,
    },
    cardDescription: {
        fontSize: 13,
        color: "#6B6B6B",
        lineHeight: 18,
        marginBottom: 8,
    },
    cardLink: { fontSize: 13, color: "#7AA61C", fontWeight: "600" },
    feedbackBox: { padding: 24, alignItems: "center" },
    feedbackText: { color: "#6B6B6B", fontSize: 14, textAlign: "center" },
});