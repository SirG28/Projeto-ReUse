import { Categoria } from "@prisma/client";

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: "ELETRONICOS", label: "Eletrônicos" },
  { value: "MOVEIS_DECORACAO", label: "Móveis e Decoração" },
  { value: "ROUPAS_ACESSORIOS", label: "Roupas e Acessórios" },
  { value: "LIVROS_MIDIA", label: "Livros e Mídia" },
  { value: "ESPORTE_LAZER", label: "Esporte e Lazer" },
  { value: "BRINQUEDOS_INFANTIL", label: "Brinquedos e Infantil" },
  { value: "ELETRODOMESTICOS", label: "Eletrodomésticos" },
  { value: "INSTRUMENTOS_MUSICAIS", label: "Instrumentos Musicais" },
  { value: "FERRAMENTAS_JARDIM", label: "Ferramentas e Jardim" },
  { value: "OUTROS", label: "Outros" },
];

export function categoriaLabel(categoria: Categoria): string {
  return CATEGORIAS.find((c) => c.value === categoria)?.label ?? categoria;
}

// Usado para validar valores vindos de formulários/query strings, que
// chegam como string solta e não como o tipo Categoria.
export function parseCategoria(value: FormDataEntryValue | string | null | undefined): Categoria {
  const match = CATEGORIAS.find((c) => c.value === value);
  return match?.value ?? "OUTROS";
}
