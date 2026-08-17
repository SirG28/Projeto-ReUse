// app/register.tsx
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import PrimaryButton from "../components/ui/PrimaryButton";
import { register } from "../services/authService";
import { buscarCep } from "../services/cepService";

export default function RegisterScreen() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [cep, setCep] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);

    // Quando o CEP atinge 8 dígitos, busca no ViaCEP automaticamente
    useEffect(() => {
        const cepLimpo = cep.replace(/\D/g, "");
        if (cepLimpo.length === 8) {
            preencherEnderecoPorCep(cepLimpo);
        }
    }, [cep]);

    async function preencherEnderecoPorCep(cepLimpo: string) {
        setBuscandoCep(true);
        try {
            const dados = await buscarCep(cepLimpo);
            setCidade(dados.localidade);
            setEstado(dados.uf);
        } catch (error: any) {
            Alert.alert("CEP", error?.message || "Não foi possível buscar o CEP.");
        } finally {
            setBuscandoCep(false);
        }
    }

    async function handleRegister() {
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
            return;
        }
        if (senha !== confirmarSenha) {
            Alert.alert("Atenção", "As senhas não conferem.");
            return;
        }
        if (senha.length < 4) {
            Alert.alert("Atenção", "A senha precisa ter pelo menos 4 caracteres.");
            return;
        }

        setCarregando(true);
        try {
            await register({
                name: nome,
                email,
                password: senha,
                cep,
                cidade,
                estado,
            });
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.replace("/home");
        } catch (error: any) {
            Alert.alert("Erro", error?.message || "Não foi possível criar a conta.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1 }} entering={FadeInDown.duration(220)}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.headerButton}
                    >
                        <Text style={styles.headerIcon}>‹</Text>
                    </Pressable>
                    <Text style={styles.headerTitle}>Criar conta</Text>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.label}>Nome completo *</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Como devemos te chamar?"
                        placeholderTextColor="#B9B9B9"
                    />

                    <Text style={styles.label}>E-mail *</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="seuemail@exemplo.com"
                        placeholderTextColor="#B9B9B9"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Senha *</Text>
                    <TextInput
                        style={styles.input}
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Mínimo 4 caracteres"
                        placeholderTextColor="#B9B9B9"
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmar senha *</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        placeholder="Repita a senha"
                        placeholderTextColor="#B9B9B9"
                        secureTextEntry
                    />

                    <Text style={styles.sectionTitle}>Endereço</Text>

                    <View style={styles.cepRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>CEP</Text>
                            <TextInput
                                style={styles.input}
                                value={cep}
                                onChangeText={setCep}
                                placeholder="00000-000"
                                placeholderTextColor="#B9B9B9"
                                keyboardType="numeric"
                                maxLength={9}
                            />
                        </View>
                        {buscandoCep && (
                            <ActivityIndicator
                                size="small"
                                color="#7AA61C"
                                style={styles.cepLoader}
                            />
                        )}
                    </View>

                    <Text style={styles.label}>Cidade</Text>
                    <TextInput
                        style={styles.input}
                        value={cidade}
                        onChangeText={setCidade}
                        placeholder="Sua cidade"
                        placeholderTextColor="#B9B9B9"
                    />

                    <Text style={styles.label}>Estado</Text>
                    <TextInput
                        style={styles.input}
                        value={estado}
                        onChangeText={setEstado}
                        placeholder="UF"
                        placeholderTextColor="#B9B9B9"
                        maxLength={2}
                        autoCapitalize="characters"
                    />

                    <View style={{ marginTop: 20 }}>
                        {carregando ? (
                            <ActivityIndicator size="large" color="#7AA61C" />
                        ) : (
                            <PrimaryButton
                                title="Criar conta"
                                onPress={handleRegister}
                            />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            </Animated.View>
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
    headerButton: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    headerIcon: { fontSize: 28, color: "#7AA61C", lineHeight: 32 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
    content: { padding: 20, paddingBottom: 40 },
    label: { fontSize: 14, color: "#2F2F2F", marginBottom: 6 },
    input: {
        width: "100%",
        height: 44,
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: "#2B2B2B",
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2F2F2F",
        marginTop: 8,
        marginBottom: 14,
    },
    cepRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    cepLoader: {
        marginLeft: 12,
        marginTop: 14,
    },
});