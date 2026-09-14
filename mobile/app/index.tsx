import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import BannerCard from "../components/BannerCard";
import Header from "../components/Header";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        async function checkLogin() {
            const logado = await AsyncStorage.getItem("@reuse_logado");

            if (logado === "true") {
                router.replace("/home");
            }
        }

        checkLogin();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <BannerCard />

            <Text style={styles.title}>
                Dê uma nova vida aos objetos que você não usa mais,
                encontrando produtos reutilizáveis.
            </Text>

            <Text style={styles.text}>
                Milhares de produtos em bom estado são descartados todos os dias.
            </Text>

            <Text style={styles.text}>
                O ReUse conecta pessoas para reutilizar e reduzir desperdício.
            </Text>

            <View style={styles.buttonArea}>
                <PrimaryButton
                    title="Começar"
                    onPress={() => router.push("/login")}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 18,
        backgroundColor: "#F7F9F5",
    },

    /* Título grande (protótipo) */
    title: {
        fontSize: 26,
        fontWeight: "800",
        lineHeight: 34,
        marginTop: 32,     // espaço entre banner e título
        marginBottom: 20,  // espaço até o primeiro texto menor
        color: "#273D3A",
    },

    /* Textos menores (protótipo) */
    text: {
        fontSize: 18,
        lineHeight: 20,
        marginBottom: 10,
        color: "#273D3A",
    },

    buttonArea: {
        marginTop: "auto",
        paddingBottom: 24,
    },

});

