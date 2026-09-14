import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Contas de teste avulsas, criadas manualmente durante o desenvolvimento
// (cadastro/testes), que não fazem parte da demonstração final.
const EMAILS_DE_TESTE_PARA_REMOVER = [
  "carla@reuse.com",
  "kris@kris.com",
  "sarah@reuse.com",
  "accffers@gmail.com",
];

async function main() {
  const senhaHash = await bcrypt.hash("reuse123", 10);

  await prisma.user.deleteMany({
    where: { email: { in: EMAILS_DE_TESTE_PARA_REMOVER } },
  });

  const ana = await prisma.user.upsert({
    where: { email: "ana@reuse.com" },
    update: {},
    create: {
      name: "Ana Carolina",
      email: "ana@reuse.com",
      passwordHash: senhaHash,
      cep: "01310100",
      cidade: "São Paulo",
      estado: "SP",
    },
  });

  const bruno = await prisma.user.upsert({
    where: { email: "bruno@reuse.com" },
    update: {},
    create: {
      name: "Bruno Ferreira",
      email: "bruno@reuse.com",
      passwordHash: senhaHash,
      cep: "20040020",
      cidade: "Rio de Janeiro",
      estado: "RJ",
    },
  });

  const camila = await prisma.user.upsert({
    where: { email: "camila@reuse.com" },
    update: {},
    create: {
      name: "Camila Rocha",
      email: "camila@reuse.com",
      passwordHash: senhaHash,
      cep: "30130010",
      cidade: "Belo Horizonte",
      estado: "MG",
    },
  });

  const diego = await prisma.user.upsert({
    where: { email: "diego@reuse.com" },
    update: {},
    create: {
      name: "Diego Santos",
      email: "diego@reuse.com",
      passwordHash: senhaHash,
      cep: "80010000",
      cidade: "Curitiba",
      estado: "PR",
    },
  });

  // Reinicia os itens das quatro contas de demonstração — o onDelete: Cascade
  // do schema já remove comentários, histórico de visualização e favoritos
  // ligados a eles.
  await prisma.item.deleteMany({
    where: { userId: { in: [ana.id, bruno.id, camila.id, diego.id] } },
  });

  const [quadro, , cafeteira, , , , bicicleta, furadeira, violao, mouse] =
    await Promise.all([
      prisma.item.create({
        data: {
          titulo: "Quadro decorativo",
          descricao:
            "Pintura em acrílico sobre tela, 32cm x 24cm, moldura de madeira maciça. Comprei há pouco tempo, mas não combinou com a decoração da sala.",
          troca: "Outros quadros, vasos ou itens de decoração",
          categoria: "MOVEIS_DECORACAO",
          whatsapp: "(11) 91234-5678",
          imagem:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
          userId: ana.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Coleção de livros de ficção",
          descricao:
            "12 livros de ficção científica e fantasia, capa comum, todos em ótimo estado — li cada um só uma vez. Inclui títulos de Asimov e Tolkien.",
          troca: "Outros livros, HQs ou mangás",
          categoria: "LIVROS_MIDIA",
          whatsapp: "(11) 91234-5678",
          imagem:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
          userId: ana.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Cafeteira elétrica",
          descricao:
            "Cafeteira de filtro com jarra térmica, faz até 6 xícaras de uma vez. Funciona perfeitamente — só estou trocando por uma versão espresso.",
          troca: "Cafeteira espresso ou máquina de café em cápsulas",
          categoria: "ELETRODOMESTICOS",
          whatsapp: "(11) 91234-5678",
          imagem:
            "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600",
          userId: ana.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Jaqueta jeans",
          descricao:
            "Jaqueta jeans clara, tamanho M, usada poucas vezes. Modelo atemporal, veste bem tanto justa quanto solta.",
          troca: "Roupas de frio tamanho M ou G",
          categoria: "ROUPAS_ACESSORIOS",
          whatsapp: "(11) 91234-5678",
          imagem:
            "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600",
          userId: ana.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Fone de ouvido bluetooth",
          descricao:
            "Fone on-ear sem fio, bateria dura cerca de 15h, som bem equilibrado. Pouco uso, sem arranhões.",
          troca: "Caixa de som bluetooth ou outro fone",
          categoria: "ELETRONICOS",
          whatsapp: "(11) 91234-5678",
          imagem:
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
          userId: ana.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Relógio smartwatch",
          descricao:
            "Smartwatch com monitor de batimentos e notificações do celular. Tela sem riscos, pulseira de silicone inclusa.",
          troca: "Outro smartwatch ou fone sem fio",
          categoria: "ELETRONICOS",
          whatsapp: "(11) 91234-5678",
          imagem:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
          userId: ana.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Bicicleta aro 26",
          descricao:
            "Bicicleta usada, bom estado geral, poucos arranhões na pintura. Freios e câmbio revisados recentemente.",
          troca: "Skate, patins ou bicicleta aro menor",
          categoria: "ESPORTE_LAZER",
          whatsapp: "(21) 99876-5432",
          imagem:
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600",
          userId: bruno.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Furadeira elétrica",
          descricao:
            "Furadeira/parafusadeira com bateria e carregador, pouco uso. Vem com maleta, mas sem jogo de brocas.",
          troca: "Outras ferramentas elétricas ou itens de jardinagem",
          categoria: "FERRAMENTAS_JARDIM",
          whatsapp: "(21) 99876-5432",
          imagem:
            "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600",
          userId: bruno.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Violão acústico",
          descricao:
            "Violão folk com cordas de aço, corpo em bom estado. O afinador embutido já não pega mais o sinal direito, mas afinar no aplicativo resolve.",
          troca: "Teclado, cavaquinho ou outro instrumento",
          categoria: "INSTRUMENTOS_MUSICAIS",
          whatsapp: "(21) 99876-5432",
          imagem:
            "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600",
          userId: bruno.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Mouse gamer sem fio",
          descricao:
            "Mouse gamer com sensor de alta precisão, poucos meses de uso, bateria em ótimo estado.",
          troca: "Teclado mecânico ou headset gamer",
          categoria: "ELETRONICOS",
          whatsapp: "(21) 99876-5432",
          imagem:
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
          userId: bruno.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Tênis de corrida",
          descricao:
            "Tênis de corrida número 41, amortecimento ainda bom, usado em poucos treinos.",
          troca: "Tênis de outro número ou equipamento esportivo",
          categoria: "ESPORTE_LAZER",
          whatsapp: "(21) 99876-5432",
          imagem:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
          userId: bruno.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Mochila para notebook",
          descricao:
            "Mochila com compartimento acolchoado para notebook até 15 polegadas e bolso extra para carregador e cabos. Uso leve.",
          troca: "Mala de viagem ou outra mochila",
          categoria: "ROUPAS_ACESSORIOS",
          whatsapp: "(21) 99876-5432",
          imagem:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
          userId: bruno.id,
        },
      }),
    ]);

  const [jogoTabuleiro, , camera, , , , , teclado, ferramentas] =
    await Promise.all([
      prisma.item.create({
        data: {
          titulo: "Jogo de tabuleiro",
          descricao:
            "Jogo de estratégia para 2 a 4 jogadores, caixa um pouco desgastada mas todas as peças completas.",
          troca: "Outros jogos de tabuleiro ou cartas",
          categoria: "BRINQUEDOS_INFANTIL",
          whatsapp: "(31) 98765-4321",
          imagem:
            "https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?w=600",
          userId: camila.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Planta ornamental em vaso",
          descricao:
            "Planta de interior já adulta, vaso de cerâmica incluso. Precisa de pouca luz direta.",
          troca: "Outra planta ou vaso decorativo",
          categoria: "OUTROS",
          whatsapp: "(31) 98765-4321",
          imagem:
            "https://images.unsplash.com/photo-1669392597221-bbfd4b6e13ff?w=600",
          userId: camila.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Câmera fotográfica antiga",
          descricao:
            "Câmera analógica funcionando, ótima pra quem coleciona ou quer aprender fotografia em filme.",
          troca: "Lente fotográfica ou câmera digital compacta",
          categoria: "ELETRONICOS",
          whatsapp: "(31) 98765-4321",
          imagem:
            "https://images.unsplash.com/photo-1603208234872-619ffa1209cb?w=600",
          userId: camila.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Bolsa de couro",
          descricao:
            "Bolsa de couro legítimo, cor caramelo, alça ajustável. Usada poucas vezes, sem manchas.",
          troca: "Outra bolsa ou mochila de couro",
          categoria: "ROUPAS_ACESSORIOS",
          whatsapp: "(31) 98765-4321",
          imagem:
            "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=600",
          userId: camila.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Skate completo",
          descricao:
            "Skate montado, rolamentos revisados recentemente. Ótimo pra quem tá começando.",
          troca: "Patins, bicicleta ou outro equipamento de rua",
          categoria: "ESPORTE_LAZER",
          whatsapp: "(31) 98765-4321",
          imagem:
            "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600",
          userId: camila.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Boneco de ação colecionável",
          descricao:
            "Action figure articulado, ainda na embalagem original, nunca aberto.",
          troca: "Outro colecionável ou boneco de ação",
          categoria: "BRINQUEDOS_INFANTIL",
          whatsapp: "(41) 99123-4567",
          imagem:
            "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=600",
          userId: diego.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Luminária de mesa",
          descricao:
            "Luminária de mesa com braço articulado e regulagem de intensidade. Funcionando perfeitamente.",
          troca: "Outra luminária ou objeto de decoração",
          categoria: "OUTROS",
          whatsapp: "(41) 99123-4567",
          imagem:
            "https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=600",
          userId: diego.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Teclado musical",
          descricao:
            "Teclado de 61 teclas com vários timbres e ritmos, fonte inclusa. Ótimo pra iniciantes.",
          troca: "Violão, cavaquinho ou outro instrumento",
          categoria: "INSTRUMENTOS_MUSICAIS",
          whatsapp: "(41) 99123-4567",
          imagem:
            "https://images.unsplash.com/photo-1538402074774-8e624f3f7e5d?w=600",
          userId: diego.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Kit de ferramentas manuais",
          descricao:
            "Maleta com chaves de fenda, alicates e chaves allen, praticamente completa. Pouco uso.",
          troca: "Furadeira, parafusadeira ou outra ferramenta",
          categoria: "FERRAMENTAS_JARDIM",
          whatsapp: "(41) 99123-4567",
          imagem:
            "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600",
          userId: diego.id,
        },
      }),
      prisma.item.create({
        data: {
          titulo: "Cadeira de escritório",
          descricao:
            "Cadeira giratória com apoio de braço e ajuste de altura. Estofado em bom estado.",
          troca: "Outra cadeira ou mesa de escritório",
          categoria: "MOVEIS_DECORACAO",
          whatsapp: "(41) 99123-4567",
          imagem:
            "https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?w=600",
          userId: diego.id,
        },
      }),
    ]);

  // Comentários e respostas simuladas — sempre entre as duas contas (o dono
  // de um item não comenta nele mesmo, regra da própria plataforma).
  async function conversa(
    itemId: string,
    pergunta: { autor: string; texto: string },
    resposta?: { autor: string; texto: string }
  ) {
    const comentario = await prisma.comment.create({
      data: { conteudo: pergunta.texto, itemId, userId: pergunta.autor },
    });
    if (resposta) {
      await prisma.comment.create({
        data: {
          conteudo: resposta.texto,
          itemId,
          userId: resposta.autor,
          parentId: comentario.id,
        },
      });
    }
  }

  await conversa(
    quadro.id,
    { autor: bruno.id, texto: "Oi! Ainda está disponível? A moldura tem quanto de espessura?" },
    { autor: ana.id, texto: "Oi, Bruno! Sim, ainda tenho. A moldura tem uns 2cm de espessura." }
  );

  await conversa(
    bicicleta.id,
    { autor: ana.id, texto: "Essa bike serve pra alguém de 1,60m?" },
    { autor: bruno.id, texto: "Serve sim! O quadro é tamanho M e dá pra baixar bastante o banco." }
  );

  await conversa(
    cafeteira.id,
    { autor: bruno.id, texto: "Ela faz quantas xícaras de uma vez?" },
    { autor: ana.id, texto: "Até 6 xícaras! Muito prática pra quem recebe visita." }
  );

  await conversa(
    violao.id,
    { autor: ana.id, texto: "As cordas são de aço ou nylon?" },
    { autor: bruno.id, texto: "São de aço, o som fica bem brilhante." }
  );

  // Comentários ainda sem resposta, pra mostrar esse estado também
  await conversa(furadeira.id, {
    autor: ana.id,
    texto: "Vem com o jogo de brocas ou só o corpo da furadeira?",
  });

  await conversa(mouse.id, {
    autor: ana.id,
    texto: "É compatível com Mac ou só Windows?",
  });

  await conversa(
    jogoTabuleiro.id,
    { autor: diego.id, texto: "Ainda tem todas as peças e o dado?" },
    { autor: camila.id, texto: "Tem sim, conferi tudo antes de anunciar!" }
  );

  await conversa(
    teclado.id,
    { autor: camila.id, texto: "Ele precisa de pilha ou só na tomada?" },
    { autor: diego.id, texto: "Funciona nos dois — vem com o fonte, mas aceita pilha também." }
  );

  await conversa(camera.id, {
    autor: diego.id,
    texto: "Ainda vem com o filme ou só o corpo da câmera?",
  });

  await conversa(ferramentas.id, {
    autor: camila.id,
    texto: "Tem chave de fenda Phillips grande no kit?",
  });

  console.log(
    "Seed concluído: contas de teste avulsas removidas, 4 usuários de demonstração, 22 itens e comentários criados."
  );
  console.log(
    "Login de teste: ana@reuse.com / bruno@reuse.com / camila@reuse.com / diego@reuse.com — senha: reuse123"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
