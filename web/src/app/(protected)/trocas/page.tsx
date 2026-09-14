import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { cancelTradeRequestAction } from "@/app/actions/trades";
import Badge from "@/components/Badge";
import ScreenHeader from "@/components/ScreenHeader";
import SectionHeader from "@/components/SectionHeader";
import { IconSwap } from "@/components/icons";
import TradeRequestActions from "./TradeRequestActions";

export const metadata = {
  title: "Trocas",
};

const ITEM_SELECT = {
  id: true,
  titulo: true,
  imagem: true,
} as const;

const STATUS: Record<string, { label: string; tone: "pending" | "accepted" | "rejected" | "cancelled" }> = {
  PENDENTE: { label: "Pendente", tone: "pending" },
  ACEITA: { label: "Aceita", tone: "accepted" },
  RECUSADA: { label: "Recusada", tone: "rejected" },
  CANCELADA: { label: "Cancelada", tone: "cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const info = STATUS[status];
  if (!info) return null;
  return <Badge tone={info.tone}>{info.label}</Badge>;
}

// Link em vez de div: em telas maiores, com a imagem bem maior, dá pra abrir
// o item direto daqui em vez de precisar ir na aba "Itens" procurar de novo.
function MiniItem({ item }: { item: { id: string; titulo: string; imagem: string | null } }) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="focus-ring flex min-w-0 flex-1 items-center gap-2 rounded-lg md:gap-3"
    >
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-reuse-surface-sunken md:h-16 md:w-16">
        {item.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-reuse-neutral-200" />
        )}
      </div>
      <p className="truncate text-[13px] font-semibold text-reuse-text md:text-sm">{item.titulo}</p>
    </Link>
  );
}

// Fileira de itens + seta de troca: em telas maiores, ao lado do status/ações
// na mesma linha em vez de empilhado (ver o componente pai) — sozinha ela já
// ocupa a largura toda tanto no mobile quanto no desktop.
function ItemsRow({
  esquerda,
  direita,
}: {
  esquerda: { id: string; titulo: string; imagem: string | null };
  direita: { id: string; titulo: string; imagem: string | null };
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
      <MiniItem item={esquerda} />
      <IconSwap size={16} className="shrink-0 text-reuse-text-secondary" />
      <MiniItem item={direita} />
    </div>
  );
}

export default async function TrocasPage() {
  const user = await requireSession();

  const [recebidas, enviadas] = await Promise.all([
    prisma.tradeRequest.findMany({
      where: { itemDesejado: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      include: {
        itemDesejado: { select: ITEM_SELECT },
        itemOfertado: { select: ITEM_SELECT },
        solicitante: { select: { name: true } },
      },
    }),
    prisma.tradeRequest.findMany({
      where: { solicitanteId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        itemDesejado: { select: { ...ITEM_SELECT, user: { select: { name: true } } } },
        itemOfertado: { select: ITEM_SELECT },
      },
    }),
  ]);

  return (
    <div className="animate-page-in">
      <ScreenHeader title="Trocas" backHref="/home" />

      <div className="px-4 pt-4">
        <SectionHeader title="Recebidas" />
        {recebidas.length === 0 ? (
          <p className="mb-6 text-sm text-reuse-text-secondary">
            Ninguém solicitou troca pelos seus itens ainda.
          </p>
        ) : (
          <div className="mb-6 flex flex-col gap-3">
            {recebidas.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="rounded-xl border border-reuse-border bg-white p-3.5 md:p-4"
              >
                <p className="mb-3 text-xs text-reuse-text-secondary">
                  <span className="font-semibold text-reuse-text">
                    {solicitacao.solicitante.name}
                  </span>{" "}
                  quer trocar por:
                </p>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                  <ItemsRow esquerda={solicitacao.itemDesejado} direita={solicitacao.itemOfertado} />

                  <div className="md:w-56 md:shrink-0">
                    {solicitacao.status === "PENDENTE" ? (
                      <TradeRequestActions tradeRequestId={solicitacao.id} />
                    ) : (
                      <StatusBadge status={solicitacao.status} />
                    )}
                  </div>
                </div>

                {/* Numa linha própria, não espremida entre os itens e as
                    ações — como o texto tem tamanho variável, dividir a
                    largura em 3 nessa mesma linha deixava pouco espaço pros
                    itens em telas médias. */}
                {solicitacao.mensagem && (
                  <p className="mt-3 rounded-lg bg-reuse-bg px-2.5 py-2 text-sm text-reuse-text">
                    &ldquo;{solicitacao.mensagem}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <SectionHeader title="Enviadas" />
        {enviadas.length === 0 ? (
          <p className="mb-6 text-sm text-reuse-text-secondary">
            Você ainda não solicitou nenhuma troca.
          </p>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {enviadas.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="rounded-xl border border-reuse-border bg-white p-3.5 md:p-4"
              >
                <p className="mb-3 text-xs text-reuse-text-secondary">
                  Para{" "}
                  <span className="font-semibold text-reuse-text">
                    {solicitacao.itemDesejado.user.name}
                  </span>
                  , você ofereceu:
                </p>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
                  <ItemsRow esquerda={solicitacao.itemOfertado} direita={solicitacao.itemDesejado} />

                  <div className="flex items-center gap-3 md:w-56 md:shrink-0 md:justify-between">
                    <StatusBadge status={solicitacao.status} />

                    {solicitacao.status === "PENDENTE" && (
                      <form action={cancelTradeRequestAction}>
                        <input type="hidden" name="tradeRequestId" value={solicitacao.id} />
                        <button
                          type="submit"
                          className="focus-ring rounded text-[13px] font-semibold text-reuse-danger hover:underline"
                        >
                          Cancelar
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
