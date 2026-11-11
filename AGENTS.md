# AGENTS.md — Diretrizes de Governança, Git Flow & Conventional Commits

Este documento define as regras arquiteturais, o padrão de commits e o **fluxo de trabalho obrigatório** para qualquer agente de IA ou desenvolvedor atuando no repositório da **Associação Humanitária Amor em Ação**.

---

## 🚨 REGRA DE OURO: GIT FLOW & CONVENTIONAL COMMITS (OBRIGATÓRIO)

O projeto adota estritamente o **Git Flow** aliado à especificação [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

### Estrutura de Branches:
1. **`release`**: Branch de produção e lançamentos estáveis. Conectada aos deploys de produção da Vercel (`https://amoremacao.org`).
2. **`develop`**: Branch principal de desenvolvimento e integração contínua (staging). Conectada aos deploys de preview/staging da Vercel (`https://amoremacao.lagrotti.dev`).
3. **`feature/*`**, **`fix/*`**, **`refactor/*`**, **`chore/*`**: Branches de trabalho criadas para cada tarefa individual a partir de `develop`.

---

## 🔄 Fluxo Obrigatório para Agentes de IA a Cada Tarefa

> [!IMPORTANT]
> **NUNCA** faça commits ou `git push` diretamente nas branches `release` ou `develop`.  
> Siga rigorosamente os 7 passos abaixo ao receber qualquer instrução:

### 1. Início da Tarefa — Atualizar e Criar Branch
Antes de alterar qualquer código, garanta que a branch `develop` está limpa e sincronizada, e crie a branch de trabalho com nomenclatura em **inglês**:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/mission-testimonials-block
# ou fix/header-dropdown-mobile, refactor/auth-session, chore/deps-update, etc.
```

### 2. Commits Frequentes no Decorrer de Ações Críticas
- **NÃO** acumule todas as modificações para um único commit no final.
- Faça **commits atômicos e convencionais a cada etapa crítica concluída** (ex: migração de banco/schema, criação de rotas de API, criação de componentes de UI, tipagem e ajustes de SEO).
- Antes de cada commit intermediário ou final, valide o build:
```bash
npm run build
```

### 3. Padrão Conventional Commits v1.0.0 & Idioma no Código (Inglês Obrigatório)

> [!IMPORTANT]
> **REGRA DE IDIOMA:** NUNCA utilize português em:
> - Mensagens de commit e nomes de branches;
> - Nomes de funções, variáveis, arquivos de código, interfaces, tipos e constantes;
> - Comentários e docstrings internos de código;
> - Títulos e descrições técnicas de Pull Requests.
> 
> **A ÚNICA exceção permitida em português:**
> 1. URLs das rotas públicas voltadas aos usuários (ex: `/acoes`, `/transparencia`, `/voluntariado`, `/contato`, `/sobre`, etc.);
> 2. Conteúdo textual visual exibido na interface pública para os usuários do portal da ONG brasileira.

Todos os commits DEVEM seguir o padrão Conventional Commits estritamente em **inglês**:
```
<tipo>[escopo opcional]: <descrição curta no imperativo em inglês>

[corpo opcional detalhando motivação e mudanças em inglês]

[rodapé opcional: BREAKING CHANGE ou referências a issues]
```

#### Tipos Permitidos:
- **`feat`**: Nova funcionalidade para o usuário (ex: novo bloco de missão, novo campo na transparência).
- **`fix`**: Correção de bug no código ou na interface.
- **`docs`**: Alterações exclusivamente em documentação (`README.md`, `AGENTS.md`, etc.).
- **`style`**: Ajustes de formatação, espaçamento ou lint que não alteram a lógica.
- **`refactor`**: Refatoração de código que não adiciona feature nem corrige bug.
- **`perf`**: Mudança focada em melhoria de desempenho.
- **`test`**: Adição ou ajuste de testes.
- **`build`**: Alterações em dependências (`package.json`), build ou tooling Next.js.
- **`ci`**: Alterações nos arquivos de integração contínua (`.github/workflows`).
- **`chore`**: Tarefas de manutenção rotineiras que não afetam o código de produção.

#### Exemplos Válidos (Sempre em Inglês):
```bash
git commit -m "feat(cms): add testimonials block to mission builder"
git commit -m "fix(header): correct actions dropdown alignment on mobile"
git commit -m "docs(agents): document git flow and english code conventions"
git commit -m "refactor(auth): simplify session cookie validation helper"
```

### 4. Push da Branch da Tarefa
Envie a branch criada para o repositório remoto:
```bash
git push -u origin feature/mission-testimonials-block
```

### 5. Abertura do Pull Request para `develop`
Abra o PR com destino estritamente à branch `develop`, com título e descrição técnica em **inglês**:
```bash
gh pr create --base develop --head feature/mission-testimonials-block \
  --title "feat(cms): add testimonials block to mission builder" \
  --body "Clear description of changes in english..."
```

### 6. Merge na `develop` e Exclusão da Branch de Trabalho
Realize o merge do PR na branch `develop` e apague a branch de trabalho (local e remotamente):
```bash
gh pr merge <numero_do_pr> --merge --delete-branch
```
Em seguida, garanta que a cópia local esteja em `develop` e atualizada:
```bash
git checkout develop
git pull origin develop
```

### 7. Pull Request de Release (`develop` &rarr; `release`) com Changelog Completo
Ao concluir a entrega na branch `develop`, garanta a abertura ou atualização do Pull Request para a branch `release`.  
O PR de release DEVE conter um **Changelog completo e exaustivo**, descrevendo tudo o que foi feito e todos os recursos presentes no sistema:
```bash
gh pr create --base release --head develop \
  --title "release: v1.X.X - resumo das entregas" \
  --body "## 🚀 Changelog Completo da Versão ... (descrição de tudo o que tem e foi feito)"
# Se o PR já estiver aberto, atualize seu título e corpo:
gh pr edit <numero_do_pr> --body "## 🚀 Changelog Completo da Versão..."
```

---

## 🏛️ Contexto Institucional do Projeto

- **Organização:** Associação Humanitária Amor em Ação
- **CNPJ Oficial:** `21.960.082/0001-96`
- **Sede:** Rua Tocantins, nº 30 — Jardim Gramacho, Duque de Caxias/RJ
- **Domínio Oficial de Produção:** [https://amoremacao.org/](https://amoremacao.org/)
- **Domínio de Preview / Staging:** [https://amoremacao.lagrotti.dev](https://amoremacao.lagrotti.dev)
- **Créditos do Desenvolvedor (Permanente em Metadados e Rodapé):**  
  **Yago Lagrotti Bracco** ([https://lagrotti.dev](https://lagrotti.dev))  
  *Esta menção de crédito é um requisito permanente do projeto e NÃO deve ser alterada ou removida.*

---

## 🧱 Arquitetura e Tecnologias

- **Framework:** Next.js 15 (App Router) com React 19 e TypeScript
- **Estilização:** Tailwind CSS v4 + FontAwesome 6 + Google Fonts (`DM Sans` e `Manrope`)
- **Banco de Dados & Storage:** Supabase (PostgreSQL + RLS + Storage)
- **Meios de Pagamento:** Stripe Checkout (sem webhooks complexos)
- **Editor WYSIWYG de Blog:** `@milkdown/crepe`
- **SEO & Dados Estruturados:** Schema.org JSON-LD (`NGO`, `WebSite`, `Article`, `ItemList`, `BreadcrumbList`)

---

## 📋 Regras de Implementação por Módulo

### 1. Construtor de Missões / Ações ("Elementor" Simplificado)
- O dropdown **"Nossas ações"** no cabeçalho exibe dinamicamente as **3 missões mais recentes** cadastradas.
- As páginas isoladas rodam na rota dinâmica `/acoes/[slug]`.
- Suporta blocos modulares nativos: `hero`, `image_text`, `text`, `gallery`, `cards`, `stats`, `quote`, `cta`, `contact`.

### 2. Portal da Transparência
- Gerido dinamicamente pelo painel administrativo (`/admin`).
- Suporta 4 categorias oficiais: `institucional`, `financeiro`, `atividades`, `fontes`.

### 3. Blog & Qualidade Editorial
- Editor WYSIWYG Milkdown Crepe com suporte a Markdown GFM e checagem de roundtrip.
- Cards do blog com **Pill da Imagem** e **Texto do Botão CTA** personalizáveis pelo administrador.
- Leitura estruturada: tempo estimado, sumário automático (H2/H3), modo leitura focado, síntese de voz e âncoras permanentes de parágrafos.
- **Zero dados simulados ("lixo"):** nenhuma lista estática falsa ou arquivos de seed mockados no repositório.

### 4. Autenticação Administrativa (`/admin`)
- Protegida por cookie de sessão seguro (`HttpOnly`, HMAC-SHA256).
- Autentica exclusivamente via **Supabase Auth** (`supabase.auth.signInWithPassword`), provisionado via `supabase/create_admin.sql` ou Supabase Dashboard (`Authentication -> Users`).

---

## 🛠️ Comandos de Verificação

```bash
# Instalação limpa
npm install

# Validação estrita de tipos e compilação de produção
npm run build

# Execução do servidor de desenvolvimento
npm run dev
```
