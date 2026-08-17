import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import PrimaryButton from "../components/ui/PrimaryButton";
import BottomNav from "../components/home/BottomNav";
import { useToast } from "../components/ui/ToastProvider";

export default function PublicItemScreen() {
    const router = useRouter();
    const { showToast } = useToast();

    const [imagem, setImagem] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [troca, setTroca] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [showExitModal, setShowExitModal] = useState(false);

    async function abrirCamera() {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Permissão necessária",
                    "Você precisa permitir o acesso à câmera para tirar a foto do item."
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!result.canceled) {
                setImagem(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível abrir a câmera.");
        }
    }

    async function handlePublicar() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (!titulo || !descricao || !troca || !whatsapp) {
            Alert.alert(
                "Atenção",
                "Preencha pelo menos título, descrição, troca e WhatsApp."
            );
            return;
        }

        try {
            // Pega o usuário logado pra pôr o userId
            const { getCurrentUser } = await import("../services/authService");
            const { createItem } = await import("../services/itemsService");
            const usuario = await getCurrentUser();

            // 1. Cria na API
            const novoItem = await createItem({
                titulo,
                descricao,
                troca,
                imagem: imagem || undefined,
                whatsapp,
                userId: usuario?.id,
            });

            // 2. Salva também no AsyncStorage (Meus Itens local)
            const itensSalvos = await AsyncStorage.getItem("@reuse_itens");
            const itens = itensSalvos ? JSON.parse(itensSalvos) : [];

            const itemLocal = {
                id: novoItem.id,
                titulo,
                descricao,
                troca,
                whatsapp,
                email,
                imagem,
                userId: usuario?.id, 
                criadoEm: new Date().toISOString(),
            };

            await AsyncStorage.setItem(
                "@reuse_itens",
                JSON.stringify([...itens, itemLocal])
            );

            // 3. Pontos (gamificação)
            const pontosSalvos = await AsyncStorage.getItem("@reuse_pontos");
            const pontosAtuais = pontosSalvos ? parseInt(pontosSalvos) : 0;
            await AsyncStorage.setItem(
                "@reuse_pontos",
                String(pontosAtuais + 50)
            );

            showToast("Item publicado com sucesso!");
            router.back();
        } catch (error: any) {
            console.log("Erro ao publicar:", error?.message);
            Alert.alert(
                "Erro",
                "Não foi possível publicar o item. Verifique sua conexão."
            );
        }
    }

    function handleFechar() {
        setShowExitModal(true);
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.headerButton}>
                            <Text style={styles.headerIcon}>‹</Text>
                        </Pressable>

                        <Text style={styles.headerTitle}>Publicar item</Text>

                        <Pressable onPress={handleFechar} style={styles.headerButton}>
                            <Text style={styles.headerIcon}>×</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        <View style={styles.imageArea}>
                            {imagem ? (
                                <Image source={{ uri: imagem }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.placeholderArea} />
                            )}

                            <Pressable style={styles.photoButton} onPress={abrirCamera}>
                                <Text style={styles.photoButtonText}>＋ Adicionar foto</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.sectionTitle}>Produto</Text>

                        <Text style={styles.label}>Título do Produto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex.: Quadro decorativo"
                            placeholderTextColor="#B9B9B9"
                            value={titulo}
                            onChangeText={setTitulo}
                        />

                        <Text style={styles.label}>Descrição do Produto</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ex.: 32cm x 24cm, moldura de madeira e pintura feita de acrílico."
                            placeholderTextColor="#B9B9B9"
                            multiline
                            value={descricao}
                            onChangeText={setDescricao}
                        />

                        <Text style={styles.sectionTitle}>Troca</Text>

                        <Text style={styles.label}>Trocas que você aceita</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ex.: Quadros semelhantes ou outras decorações de parede"
                            placeholderTextColor="#B9B9B9"
                            multiline
                            value={troca}
                            onChangeText={setTroca}
                        />

                        <Text style={styles.sectionTitle}>Formas de contato</Text>

                        <Text style={styles.label}>WhatsApp (Obrigatório)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="(xx) x xxxx-xxxx"
                            placeholderTextColor="#B9B9B9"
                            keyboardType="phone-pad"
                            value={whatsapp}
                            onChangeText={setWhatsapp}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="lorem@gmail.com"
                            placeholderTextColor="#B9B9B9"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <View style={styles.buttonArea}>
                            <PrimaryButton title="+   Publicar item" onPress={handlePublicar} />
                        </View>
                    </ScrollView>

                    <Modal
                        visible={showExitModal}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setShowExitModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalCard}>
                                <Pressable
                                    style={styles.modalCloseButton}
                                    onPress={() => setShowExitModal(false)}
                                >
                                    <Text style={styles.modalCloseText}>×</Text>
                                </Pressable>

                                <Text style={styles.modalTitle}>
                                    Você deseja continuar a publicação desse item?
                                </Text>

                                <Text style={styles.modalDescription}>
                                    Ao sair dessa tela, você cancelará a publicação desse item
                                </Text>

                                <Pressable
                                    style={styles.modalPrimaryButton}
                                    onPress={() => setShowExitModal(false)}
                                >
                                    <Text style={styles.modalPrimaryButtonText}>
                                        Sim, voltar para publicação
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={styles.modalSecondaryButton}
                                    onPress={() => {
                                        setShowExitModal(false);
                                        router.back();
                                    }}
                                >
                                    <Text style={styles.modalSecondaryButtonText}>
                                        Não, sair e cancelar item
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9F5",
    },

    scroll: {
        flex: 1,
    },

    header: {
        height: 56,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5E5",
        backgroundColor: "#F7F9F5",
    },

    headerButton: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },

    headerIcon: {
        fontSize: 22,
        color: "#7AA61C",
    },

    headerTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2F2F2F",
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 80,
    },

    imageArea: {
        height: 190,
        backgroundColor: "#ECECEC",
        marginBottom: 24,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    placeholderArea: {
        width: "100%",
        height: "100%",
        backgroundColor: "#E9E9E9",
    },

    previewImage: {
        width: "100%",
        height: "100%",
    },

    photoButton: {
        position: "absolute",
        borderWidth: 1,
        borderColor: "#7AA61C",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#F7F9F5",
    },

    photoButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#7AA61C",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 14,
    },

    label: {
        fontSize: 14,
        color: "#2F2F2F",
        marginBottom: 6,
    },

    input: {
        width: "100%",
        minHeight: 44,
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#2B2B2B",
        marginBottom: 14,
    },

    textArea: {
        minHeight: 72,
        textAlignVertical: "top",
    },

    buttonArea: {
        marginTop: 14,
        marginBottom: 20,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end",
        paddingHorizontal: 10,
        paddingBottom: 0,
    },

    modalCard: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 22,
        paddingBottom: 24,
        minHeight: 260,
    },

    modalCloseButton: {
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 1,
    },

    modalCloseText: {
        fontSize: 22,
        color: "#2F2F2F",
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2F2F2F",
        lineHeight: 26,
        marginTop: 8,
        marginBottom: 14,
        paddingRight: 24,
    },

    modalDescription: {
        fontSize: 15,
        color: "#2F2F2F",
        lineHeight: 22,
        marginBottom: 28,
    },

    modalPrimaryButton: {
        backgroundColor: "#6A9E1F",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        marginBottom: 10,
    },

    modalPrimaryButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },

    modalSecondaryButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#6A9E1F",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
    },

    modalSecondaryButtonText: {
        color: "#6A9E1F",
        fontSize: 13,
        fontWeight: "700",
    },
});