import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { getCurrentUser, logout, User } from "../services/authService";
import BottomNav from "../components/home/BottomNav";

export default function ProfileScreen() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<User | null>(null);

    useEffect(() => {
        carregarUsuario();
    }, []);

    async function carregarUsuario() {
        const user = await getCurrentUser();
        setUsuario(user);
    }

    async function handleLogout() {
        Alert.alert("Sair da conta", "Deseja realmente sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logout();
                        router.replace("/login");
                    } catch (error) {
                        Alert.alert("Erro", "Não foi possível sair da conta.");
                    }
                },
            },
        ]);
    }

    const inicial = usuario?.name?.charAt(0).toUpperCase() ?? "U";

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <Animated.View style={{ flex: 1 }} entering={FadeInDown.duration(220)}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{inicial}</Text>
                </View>

                <Text style={styles.name}>{usuario?.name ?? "Usuário"}</Text>
                <Text style={styles.email}>{usuario?.email ?? "Sem e-mail"}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Conta</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nome</Text>
                        <Text style={styles.infoValue}>
                            {usuario?.name ?? "Usuário"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>E-mail</Text>
                        <Text style={styles.infoValue}>{usuario?.email ?? "-"}</Text>
                    </View>

                    {usuario?.cidade ? (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Cidade</Text>
                            <Text style={styles.infoValue}>
                                {usuario.cidade}
                                {usuario.estado ? ` - ${usuario.estado}` : ""}
                            </Text>
                        </View>
                    ) : null}

                    <View style={[styles.infoRow, styles.infoRowLast]}>
                        <Text style={styles.infoLabel}>Sessão</Text>
                        <Text style={styles.infoValue}>Ativa</Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <PrimaryButton
                        title="Meus Itens"
                        onPress={() => router.push("/myItems")}
                    />
                    <SecondaryButton title="Sair da conta" onPress={handleLogout} />
                </View>
            </View>
            </Animated.View>
            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F5" },
    header: {
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5E5",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 84,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#DCE8C2",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 8,
    },
    avatarText: { fontSize: 24, fontWeight: "700", color: "#639922" },
    name: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2F2F2F",
        textAlign: "center",
        marginBottom: 2,
    },
    email: {
        fontSize: 13,
        color: "#6B6B6B",
        textAlign: "center",
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E6E2D9",
        padding: 14,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 8,
    },
    infoRow: { marginBottom: 8 },
    infoRowLast: { marginBottom: 0 },
    infoLabel: { fontSize: 12, color: "#7A7A7A", marginBottom: 1 },
    infoValue: { fontSize: 14, color: "#2F2F2F", fontWeight: "500" },
    buttons: { marginTop: 16, gap: 8 },
});