type Props = {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
};

// Base de todos os ícones da plataforma: renderiza um glifo do Material
// Symbols (fonte carregada em src/app/layout.tsx) a partir do nome oficial
// do ícone no Google. `filled` liga o eixo de variação FILL da própria fonte
// — a mesma fonte cobre contorno e preenchido, sem precisar de dois nomes
// diferentes (ex.: favorito vazio/cheio usam o mesmo "favorite").
export default function Icon({ name, size = 16, className = "", filled = false }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined inline-block shrink-0 select-none leading-none ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}`,
      }}
    >
      {name}
    </span>
  );
}
