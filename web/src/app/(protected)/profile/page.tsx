import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import EditProfileModal from "./EditProfileModal";
import { buttonClass } from "@/components/Button";
import { iconButtonClass } from "@/components/IconButton";
import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import SectionHeader from "@/components/SectionHeader";
import { IconGear, IconPlus } from "@/components/icons";

export default async function ProfilePage() {
  const user = await requireSession();
  const inicial = user.name?.charAt(0).toUpperCase() ?? "U";

  const itemSelect = {
    id: true,
    titulo: true,
    descricao: true,
    troca: true,
    imagem: true,
    categoria: true,
    status: true,
  } as const;

  const [itens, favoritos] = await Promise.all([
    prisma.item.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: itemSelect,
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { item: { select: itemSelect } },
    }),
  ]);

  // Mesma regra de XP do mobile: +50 XP por item publicado (services/itemsService.ts + app/PublicItem.tsx)
  const pontos = itens.length * 50;

  return (
    <div className="animate-page-in">
      <ScreenHeader
        title="Meu Perfil"
        backHref="/home"
        right={
          <Link href="/settings" aria-label="Configurações" className={iconButtonClass()}>
            <IconGear size={20} />
          </Link>
        }
      />

      <div className="px-5 pt-4">
        <div className="mb-3.5 flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-reuse-avatar-bg">
            <span className="text-3xl font-bold text-reuse-green-dark">
              {inicial}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-base font-bold text-reuse-text">
              {user.name}
            </p>
            {user.cidade && (
              <p className="mb-1.5 text-xs text-reuse-text-secondary">
                {user.cidade}
                {user.estado ? ` - ${user.estado}` : ""}
              </p>
            )}

            <div className="flex gap-4">
              <p className="text-sm text-reuse-text">
                <span className="font-bold">{itens.length}</span>{" "}
                <span className="text-reuse-text-secondary">itens</span>
              </p>
              <p className="text-sm text-reuse-text">
                <span className="font-bold">{pontos}</span>{" "}
                <span className="text-reuse-text-secondary">XP</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2.5">
          <EditProfileModal
            user={{
              name: user.name,
              cep: user.cep,
              cidade: user.cidade,
              estado: user.estado,
            }}
          />
          <Link
            href="/items/new"
            className={buttonClass({ size: "sm", className: "flex-1 items-center gap-1.5" })}
          >
            <IconPlus size={14} />
            Publicar item
          </Link>
        </div>
      </div>

      <div className="mt-5 border-t border-reuse-header-border px-4 pt-4">
        <SectionHeader title="Meus Itens" />

        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[15px] text-reuse-text-secondary">
              Você ainda não publicou nenhum item.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-4">
            {itens.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="focus-ring block rounded-xl">
                <ItemCard
                  imagem={item.imagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  troca={item.troca}
                  categoria={item.categoria}
                  trocado={item.status === "TROCADO"}
                  variant="fluid"
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-reuse-header-border px-4 pt-4">
        <SectionHeader title="Favoritos" />

        {favoritos.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[15px] text-reuse-text-secondary">
              Você ainda não favoritou nenhum item.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-4">
            {favoritos.map(({ item }) => (
              <Link key={item.id} href={`/items/${item.id}`} className="focus-ring block rounded-xl">
                <ItemCard
                  imagem={item.imagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  troca={item.troca}
                  categoria={item.categoria}
                  trocado={item.status === "TROCADO"}
                  variant="fluid"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
