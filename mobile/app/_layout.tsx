import { Stack } from "expo-router";
import { ToastProvider } from "../components/ui/ToastProvider";

export default function RootLayout() {
    return (
        <ToastProvider>
            <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                <Stack.Screen
                    name="PublicItem"
                    options={{ presentation: "modal", animation: "slide_from_bottom" }}
                />
            </Stack>
        </ToastProvider>
    );
}
