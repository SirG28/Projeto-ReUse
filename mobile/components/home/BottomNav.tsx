import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import AnimatedPressable from "../ui/AnimatedPressable";

type NavItemProps = {
    active: boolean;
    onPress: () => void;
    label: string;
    icon: (color: string) => React.ReactNode;
};

function NavItem({ active, onPress, label, icon }: NavItemProps) {
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(active ? 1 : 0, { duration: 200 });
    }, [active, progress]);

    const animatedItemStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            ["transparent", "#6E9F1E"]
        ),
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(progress.value, [0, 1], ["#2F2F2F", "#FFFFFF"]),
    }));

    return (
        <AnimatedPressable
            style={[styles.navItem, animatedItemStyle]}
            onPress={onPress}
        >
            {icon(active ? "#FFFFFF" : "#000000")}
            <Animated.Text
                style={[styles.label, active && styles.activeText, animatedTextStyle]}
            >
                {label}
            </Animated.Text>
        </AnimatedPressable>
    );
}

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    function navigate(path: "/home" | "/PublicItem" | "/profile") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(path);
    }

    return (
        <Animated.View style={styles.container}>
            <NavItem
                active={isActive("/home")}
                onPress={() => navigate("/home")}
                label="Início"
                icon={(color) => (
                    <Svg width={16} height={16} viewBox="0 0 16 16" fill={color}>
                        <Path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                    </Svg>
                )}
            />

            <NavItem
                active={isActive("/PublicItem")}
                onPress={() => navigate("/PublicItem")}
                label="Itens"
                icon={(color) => (
                    <Svg width={16} height={16} viewBox="0 0 16 16" fill={color}>
                        <Path
                            fillRule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                        />
                    </Svg>
                )}
            />

            {/* Trocas (sem rota ainda) */}
            <Animated.View style={styles.navItem}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="#000000">
                    <Path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5" />
                </Svg>
                <Text style={styles.label}>Trocas</Text>
            </Animated.View>

            {/* Ranking (sem rota ainda) */}
            <Animated.View style={styles.navItem}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="#000000">
                    <Path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
                </Svg>
                <Text style={styles.label}>Ranking</Text>
            </Animated.View>

            <NavItem
                active={isActive("/profile")}
                onPress={() => navigate("/profile")}
                label="Perfil"
                icon={(color) => (
                    <Svg width={16} height={16} viewBox="0 0 16 16" fill={color}>
                        <Path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                    </Svg>
                )}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#E5E2DA",
    },
    navItem: {
        width: 58,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    label: {
        fontSize: 11,
        color: "#2F2F2F",
    },
    activeText: {
        fontWeight: "700",
    },
});
