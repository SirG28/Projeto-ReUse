// app/login.tsx
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import PrimaryButton from "../components/ui/PrimaryButton";
import Logo from "../components/Logo";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { login } from "../services/authService";

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrar, setLembrar] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarDadosSalvos();
    }, []);

    async function carregarDadosSalvos() {
        try {
            const emailSalvo = await AsyncStorage.getItem("@reuse_email");
            const lembrarSalvo = await AsyncStorage.getItem("@reuse_lembrar");

            if (lembrarSalvo === "true") {
                setLembrar(true);
                if (emailSalvo) setEmail(emailSalvo);
            }
        } catch (error) {
            console.log("Erro ao carregar dados:", error);
        }
    }

    async function handleLogin() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (!email || !senha) {
            Alert.alert("Atenção", "Preencha e-mail e senha.");
            return;
        }

        setCarregando(true);
        try {
            await login(email, senha);

            if (lembrar) {
                await AsyncStorage.setItem("@reuse_email", email);
                await AsyncStorage.setItem("@reuse_lembrar", "true");
            } else {
                await AsyncStorage.removeItem("@reuse_email");
                await AsyncStorage.setItem("@reuse_lembrar", "false");
            }

            router.replace("/home");
        } catch (error: any) {
            const msg = error?.message || "Não foi possível fazer login.";
            Alert.alert("Erro", msg);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1 }} entering={FadeInDown.duration(220)}>
            <View style={styles.content}>
                <View style={styles.headerArea}>
                    <Logo markSize={38} wordmarkSize={26} style={styles.logo} />
                    <Text style={styles.subtitle}>Entre na sua conta:</Text>
                </View>

                <View style={styles.formArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#B9B9B9"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            placeholderTextColor="#B9B9B9"
                            secureTextEntry={!mostrarSenha}
                            value={senha}
                            onChangeText={setSenha}
                        />
                        <Pressable
                            style={styles.eyeButton}
                            onPress={() => setMostrarSenha(!mostrarSenha)}
                        >
                            <Text style={styles.eyeText}>
                                {mostrarSenha ? "Ocultar" : "Mostrar"}
                            </Text>
                        </Pressable>
                    </View>

                    <Pressable
                        style={styles.checkboxRow}
                        onPress={() => setLembrar(!lembrar)}
                    >
                        <View style={styles.checkbox}>
                            {lembrar && <Text style={styles.checkIcon}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>Lembrar de mim</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Ainda não tem uma conta? </Text>
                    <Pressable onPress={() => router.push("/register")}>
                        <Text style={styles.registerLink}>Criar conta</Text>
                    </Pressable>
                </View>

                {carregando ? (
                    <ActivityIndicator size="large" color="#7AA61C" />
                ) : (
                    <PrimaryButton title="Entrar" onPress={handleLogin} />
                )}
            </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9F5",
        paddingHorizontal: 16,
    },
    content: { flex: 1 },
    headerArea: { marginTop: 88, marginBottom: 28 },
    logo: { marginBottom: 10 },
    subtitle: { fontSize: 14, color: "#7B7B7B" },
    formArea: { gap: 12 },
    input: {
        width: "100%",
        height: 42,
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: "#2B2B2B",
    },
    inputWrapper: { position: "relative", justifyContent: "center" },
    eyeButton: { position: "absolute", right: 12 },
    eyeText: { fontSize: 12, color: "#7AA61C", fontWeight: "600" },
    checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: "#707070",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        marginRight: 8,
    },
    checkIcon: { fontSize: 12, color: "#639922", fontWeight: "700" },
    checkboxText: { fontSize: 14, color: "#7B7B7B" },
    footer: { paddingBottom: 18 },
    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    registerText: { fontSize: 13, color: "#8B8B8B" },
    registerLink: {
        fontSize: 13,
        color: "#7AA61C",
        textDecorationLine: "underline",
    },
});