# Associação Humanitária Amor em Ação — Portal Oficial & CMS

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Donations-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

Portal institucional completo, sistema de gestão de missões comunitárias com construtor visual de blocos modulares, portal da transparência, blog oficial com editor WYSIWYG de alta qualidade editorial, doações via Stripe e inscrições de voluntários para a **Associação Humanitária Amor em Ação** (Jardim Gramacho · Duque de Caxias/RJ).

- **URL Oficial de Produção:** [https://amoremacao.org/](https://amoremacao.org/)
- **URL de Preview / Staging:** [https://amoremacao.lagrotti.dev](https://amoremacao.lagrotti.dev)
- **Painel Administrativo:** [https://amoremacao.org/admin](https://amoremacao.org/admin) (Produção) / [https://amoremacao.lagrotti.dev/admin](https://amoremacao.lagrotti.dev/admin) (Preview)

---

## 🌟 Funcionalidades do Projeto

### 1. Construtor Visual de Missões e Páginas Isoladas ("Elementor" Simplificado)
- **Menu Dinâmico ("Nossas ações"):** exibe dinamicamente no cabeçalho (desktop e mobile) as **3 missões mais recentes** cadastradas no CMS, com título em destaque e subtítulo descritivo.
- **Páginas Modulares Isoladas (`/acoes/[slug]`):** criadas e geridas pelo painel com componentes nativos do layout:
  - **Hero Principal:** Kicker, título, subtítulo e botões de chamada primário/secundário.
  - **Imagem + Texto (Lado a Lado):** Posição alternável (esquerda/direita), tópicos com check e botão.
  - **Galeria de Fotos:** Grade responsiva (2, 3 ou 4 colunas) com legenda e data por registro.
  - **Grade de Cards com Ícones:** Eixos de apoio com seleção de ícones FontAwesome (`fa-utensils`, `fa-soap`, `fa-heart`, etc.).
  - **Estatísticas / Métricas:** Indicadores numéricos destacados de impacto social.
  - **Texto & Conteúdo:** Editor de texto livre com suporte a formatação rica em Markdown.
  - **Notas de Apuração / Citações:** Alertas informativos ou blockquotes elegantes.
  - **Banners de Chamada (CTA):** Conversão para doações ou voluntariado.
  - **Localização & Fontes:** Endereço, Instagram e referências externas.
- **Pré-visualização em Tempo Real:** Alternância instantânea no painel entre o construtor de blocos e a prévia final da página.

### 2. Portal da Transparência Dinâmico (`/transparencia`)
- Identificação oficial da instituição (CNPJ `21.960.082/0001-96` e endereço da sede em Jardim Gramacho).
- Gestão de documentos categorizados pelo painel administrativo:
  - *Documentos Institucionais & Estatuto*
  - *Balanços & Demonstrações Financeiras*
  - *Relatórios de Atividades & Impacto*
  - *Fontes Públicas & Registros de Mídia*
- Acesso e download direto de arquivos PDF e comprovações de órgãos públicos.

### 3. Blog Oficial com Qualidade Editorial Avançada (`/blog` e `/blog/[slug]`)
- **Editor Visual Milkdown Crepe:**
  - Menu interativo `/` para títulos, listas, citações, tabelas e upload de imagens inline com texto alternativo (alt-text) para acessibilidade e SEO.
  - Modo Markdown com checagem de roundtrip (`checkMarkdownRoundtrip`).
- **Personalização Total do Card:**
  - O administrador define o texto do **Pill da imagem** (canto superior esquerdo) e o **texto do botão CTA** (canto inferior direito).
- **Leitura Imersiva:**
  - Sumário lateral automático gerado pelos subtítulos H2 e H3 (`Neste artigo`).
  - Barra de progresso de leitura e cálculo de minutos restantes.
  - **Ouvir este artigo:** síntese de voz nativa do navegador com destaque de parágrafo e controle de velocidade (`1x`, `1.25x`, `1.5x`).
  - Modo leitura focado e âncoras permanentes por parágrafo.
- **Zero "Mock Lixo":** Todos os dados operam de forma 100% dinâmica via Supabase.

### 4. Doações (Stripe Checkout & Registro Direto)
- Doações pontuais e mensais recorrentes integradas com Stripe.
- **Sem necessidade de webhooks complexos:** status do pagamento consultado e gravado automaticamente no retorno para `/doacao/sucesso` ou via botão **"Verificar no Stripe"** no painel administrativo.
- Registro manual de doações recebidas via Pix ou transferência bancária.

### 5. Voluntariado & Acolhimento
- Formulário público para cadastro de voluntários por área de interesse e disponibilidade.
- Gestão de status de voluntários no painel (`Novo`, `Contatado`, `Ativo`, `Arquivado`).
- Botão de contato direto via **WhatsApp** e **E-mail**.

### 6. Autenticação Administrativa Segura (`/admin`)
- Proteção por cookie seguro de sessão (`HttpOnly`, assinado com HMAC-SHA256).
- Autenticação flexível:
  - Via **Supabase Auth** (usuários cadastrados em `Authentication -> Users`).
  - Via variáveis de ambiente (`ADMIN_EMAIL` e `ADMIN_PASSWORD`) configuradas na Vercel.

---

## 🔀 Estratégia de Branches & Git Flow (Conventional Commits)

O repositório segue estritamente o padrão **Git Flow** e a especificação [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

- **`release`**: Branch de produção e versões estáveis (conectada à Vercel para produção).
- **`develop`**: Branch padrão de desenvolvimento contínuo e integração (staging).
- **`feature/*`**, **`fix/*`**, **`refactor/*`**: Branches de trabalho criadas a partir de `develop`.

### Fluxo de Trabalho:
1. Atualize a `develop` e crie a branch da sua tarefa:
   ```bash
   git checkout develop && git pull origin develop
   git checkout -b feature/nome-da-tarefa
   ```
2. Desenvolva, teste e faça commits seguindo o padrão Conventional Commits:
   ```bash
   git commit -m "feat(modulo): descricao no imperativo"
   ```
3. Envie a branch e abra um Pull Request para `develop`:
   ```bash
   git push -u origin feature/nome-da-tarefa
   gh pr create --base develop --head feature/nome-da-tarefa --fill
   ```
4. Para fechar uma release em produção, abra um PR de `develop` para `release`:
   ```bash
   gh pr create --base release --head develop --title "release: v1.X.X" --body "Resumo das entregas..."
   ```

---

## 🚀 Como Configurar e Executar

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/YagoLagrottiBracco/amor-em-acao.git
cd amor-em-acao
npm install
```

### 2. Configurar o Banco de Dados Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. Abra o **SQL Editor** no painel do Supabase.
3. Execute o script contido em [`supabase/schema.sql`](./supabase/schema.sql). Ele criará as tabelas `blog_posts`, `action_missions`, `transparency_documents`, `donations`, `volunteers`, os índices e as políticas de segurança RLS.

### 3. Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz com base no [`.env.example`](./.env.example):

```env
NEXT_PUBLIC_SITE_URL=https://amoremacao.org

NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

ADMIN_EMAIL=admin@amoremacao.org.br
ADMIN_PASSWORD=sua_senha_forte
ADMIN_SESSION_SECRET=segredo_hmac_longo_para_assinatura_de_cookies

STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 4. Executar Localmente

```bash
# Modo de desenvolvimento
npm run dev

# Compilação de produção
npm run build

# Executar a compilação
npm run start
```

### 5. Deploy na Vercel

```bash
# Deploy direto para preview / staging (amoremacao.lagrotti.dev)
vercel

# Deploy oficial de produção (amoremacao.org)
vercel --prod
```

---

## 🌿 Git Flow & Governança

O projeto utiliza estritamente o modelo **Git Flow** aliado ao padrão [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):
- **`develop`**: Branch padrão de desenvolvimento, staging e CI contínuo.
- **`release`**: Branch de produção com histórico protegido e estável.
- Para detalhes completos do ciclo de vida de desenvolvimento, consulte as diretrizes em [`AGENTS.md`](./AGENTS.md).

---

## 👨‍💻 Créditos de Desenvolvimento

Desenvolvido com excelência por **[Yago Lagrotti Bracco](https://lagrotti.dev)**.

Todos os direitos reservados à **Associação Humanitária Amor em Ação** (CNPJ `21.960.082/0001-96`).
