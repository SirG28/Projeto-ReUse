// services/cepService.ts
import axios from "axios";

export type CepResult = {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string; // cidade
    uf: string;         // estado (UF)
};

/**
 * Busca endereço pelo CEP no ViaCEP.
 * Aceita CEP com ou sem hífen (ex.: "01310-100" ou "01310100").
 */
export async function buscarCep(cep: string): Promise<CepResult> {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos.");
    }

    const response = await axios.get<CepResult & { erro?: boolean }>(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
        { timeout: 8000 }
    );

    if (response.data.erro) {
        throw new Error("CEP não encontrado.");
    }

    return response.data;
}