import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function BannerCard() {
    return (

        <View style={styles.card}>

            <Image
                source={require("../assets/images/banner-reuse.png")}
                style={styles.image}
            />

        </View>

    );
}

const styles = StyleSheet.create({

    card: {
        borderRadius: 16,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 166, // menor que 150, fica mais parecido com o protótipo
    },

});