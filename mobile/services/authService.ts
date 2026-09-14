// services/authService.ts
import { api } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
    id: string;
    name: string;
    email: string;
    cep?: string;
    cidade?: string;
    estado?: string;
    createdAt?: string;
};

const STORAGE_USER = "@reuse_usuario";
const STORAGE_LOGGED = "@reuse_logado";

/**
 * Busca todos os usuários e filtra pelo email no client.
 * (MockAPI dessa instância não aceita filtro via query string)
 */
async function findUserByEmail(
    email: string
): Promise<(User & { password: string }) | null> {
    const response = await api.get<(User & { password: string })[]>("/users");
    const emailNormalizado = email.trim().toLowerCase();
    const user = response.data.find(
        (u) => u.email?.toLowerCase() === emailNormalizado
    );
    return user || null;
}

export async function login(email: string, password: string): Promise<User> {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    if (user.password !== password) {
        throw new Error("Senha incorreta.");
    }

    const userToSave: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        cep: user.cep,
        cidade: user.cidade,
        estado: user.estado,
    };

    await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(userToSave));
    await AsyncStorage.setItem(STORAGE_LOGGED, "true");

    return userToSave;
}

export async function register(data: {
    name: string;
    email: string;
    password: string;
    cep?: string;
    cidade?: string;
    estado?: string;
}): Promise<User> {
    // Verifica se email já existe (filtragem client-side)
    const existing = await findUserByEmail(data.email);
    if (existing) {
        throw new Error("E-mail já cadastrado.");
    }

    // Cria o usuário (POST funciona normalmente)
    const response = await api.post<User>("/users", {
        ...data,
        email: data.email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
    });
    const user = response.data;

    const userToSave: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        cep: user.cep,
        cidade: user.cidade,
        estado: user.estado,
    };

    await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(userToSave));
    await AsyncStorage.setItem(STORAGE_LOGGED, "true");

    return userToSave;
}

export async function logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_USER);
    await AsyncStorage.removeItem(STORAGE_LOGGED);
}

export async function getCurrentUser(): Promise<User | null> {
    const logged = await AsyncStorage.getItem(STORAGE_LOGGED);
    if (logged !== "true") return null;

    const userStr = await AsyncStorage.getItem(STORAGE_USER);
    if (!userStr) return null;

    return JSON.parse(userStr);
}

export async function isLoggedIn(): Promise<boolean> {
    const logged = await AsyncStorage.getItem(STORAGE_LOGGED);
    return logged === "true";
}