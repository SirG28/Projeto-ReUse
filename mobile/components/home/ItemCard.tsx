import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  imagem?: string | null | any;
  titulo?: string;
  descricao?: string;
  troca?: string;
};

export default function ItemCard({ imagem, titulo, descricao, troca }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageArea}>
        {imagem ? (
          <Image
            source={typeof imagem === "string" ? { uri: imagem } : imagem}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>
          {titulo ?? "Sem título"}
        </Text>
        <Text style={styles.descricao} numberOfLines={2}>
          {descricao ?? "Sem descrição"}
        </Text>
        <Text style={styles.troca} numberOfLines={1}>
          Troca por: {troca ?? "-"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2DED6",
    overflow: "hidden",
  },
  imageArea: {
    width: "100%",
    height: 110,
    backgroundColor: "#F0F0EE",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E9E9E9",
  },
  info: {
    padding: 10,
    gap: 4,
  },
  titulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2F2F2F",
  },
  descricao: {
    fontSize: 12,
    color: "#6B6B6B",
    lineHeight: 16,
  },
  troca: {
    fontSize: 11,
    color: "#6E9F1E",
    fontWeight: "600",
    marginTop: 2,
  },
});
