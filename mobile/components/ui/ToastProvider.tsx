import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type ToastContextValue = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback((msg: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setMessage(msg);
        timerRef.current = setTimeout(() => setMessage(null), 2500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {message ? (
                <Animated.View
                    style={styles.toast}
                    entering={FadeInDown.duration(220)}
                    exiting={FadeOutDown.duration(220)}
                    pointerEvents="none"
                >
                    <Text style={styles.text}>{message}</Text>
                </Animated.View>
            ) : null}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast precisa ser usado dentro de <ToastProvider>");
    }
    return ctx;
}

const styles = StyleSheet.create({
    toast: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 96,
        backgroundColor: "#2F2F2F",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
});
