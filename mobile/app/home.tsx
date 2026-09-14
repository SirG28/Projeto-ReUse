// app/home.tsx
import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
    View,
    RefreshControl,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { getCurrentUser } from "../services/authService";
import HeaderHome from "../components/home/HeaderHome";
import UserSummaryCard from "../components/home/UserSummaryCard";
import SectionHeader from "../components/home/SectionHeader";
import ShortcutCard from "../components/home/ShortcutCard";
import ItemCard from "../components/home/ItemCard";
import BottomNav from "../components/home/BottomNav";
import OfflineBanner from "../components/OfflineBanner";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getItems, refreshItemsCache, Item } from "../services/itemsService";

export default function HomeScreen() {
    const router = useRouter();
    const [itens, setItens] = useState<Item[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        carregarItens();
    }, []);

    async function carregarItens() {
        try {
            setErro(null);
            const data = await getItems();
            const usuario = await getCurrentUser();

            // Esconde itens do próprio usuário (você não troca consigo mesma)
            const outros = data.filter(
                (item) => !usuario || item.userId !== usuario.id
            );

            setItens(outros);
        } catch {
            setErro("Não foi possível carregar os itens. Verifique sua conexão.");
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }

    async function onRefresh() {
        setAtualizando(true);
        await refreshItemsCache();
        await carregarItens();
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1 }} entering={FadeInDown.duration(220)}>
            <HeaderHome />

            <OfflineBanner />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={onRefresh}
                        tintColor="#7AA61C"
                    />
                }
            >
                <UserSummaryCard />

                <SectionHeader title="Atalhos" />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.shortcutsRow}
                >
                    <ShortcutCard
                        title="Publicar Item"
                        xp="+ 50 XP"
                        icon="+"
                        onPress={() => router.push("/PublicItem")}
                    />
                    <ShortcutCard
                        title="Dicas Sustentáveis"
                        xp="🌱"
                        icon="💡"
                        onPress={() => router.push("/tips")}
                    />
                    <ShortcutCard title="Realizar Troca" xp="+ 100 XP" icon="⇄" />
                    <ShortcutCard title="Ranking" xp="+ 20 XP" icon="🏆" />
                </ScrollView>

                <SectionHeader title="Itens para trocar" actionText="Ver todos" />

                {carregando ? (
                    <ActivityIndicator
                        size="large"
                        color="#7AA61C"
                        style={{ marginVertical: 30 }}
                    />
                ) : erro ? (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>{erro}</Text>
                    </View>
                ) : itens.length === 0 ? (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>
                            Nenhum item disponível ainda.
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.itemsRow}
                    >
                        {itens.map((item, i) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInRight.delay(Math.min(i, 8) * 60).duration(300)}
                            >
                                <ItemCard
                                    imagem={item.imagem}
                                    titulo={item.titulo}
                                    descricao={item.descricao}
                                    troca={item.troca}
                                />
                            </Animated.View>
                        ))}
                    </ScrollView>
                )}
            </ScrollView>
            </Animated.View>

            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9F5",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 100,
    },
    shortcutsRow: {
        paddingBottom: 18,
        gap: 10,
    },
    itemsRow: {
        paddingBottom: 18,
        gap: 12,
    },
    feedbackBox: {
        padding: 24,
        alignItems: "center",
    },
    feedbackText: {
        color: "#6B6B6B",
        fontSize: 14,
        textAlign: "center",
    },
});