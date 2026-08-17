import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita o Turbopack inferir a raiz errada: este repo também tem um
  // package-lock.json na raiz (do app mobile React Native), fora de /web.
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Padrão do Next é 1MB. A Vercel tem um teto rígido de 4.5MB por
      // requisição (Node.js runtime) — mantemos margem abaixo disso mesmo
      // com a foto já comprimida no navegador antes de enviar.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
