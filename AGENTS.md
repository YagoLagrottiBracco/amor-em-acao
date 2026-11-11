# AGENTS.md — Diretrizes de Governança, Git Flow & Conventional Commits

Este documento define as regras arquiteturais, o padrão de commits e o **fluxo de trabalho obrigatório** para qualquer agente de IA ou desenvolvedor atuando no repositório da **Associação Humanitária Amor em Ação**.

---

## 🚨 REGRA DE OURO: GIT FLOW & CONVENTIONAL COMMITS (OBRIGATÓRIO)

O projeto adota estritamente o **Git Flow** aliado à especificação [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

### Estrutura de Branches:
1. **`release`**: Branch de produção e lançamentos estáveis. Conectada aos deploys de produção da Vercel (`https://amoremacao.lagrotti.dev`).
2. **`develop`**: Branch principal de desenvolvimento e integração contínua (staging).
3. **`feature/*`**, **`fix/*`**, **`refactor/*`**, **`chore/*`**: Branches de trabalho criadas para cada tarefa individual a partir de `develop`.

---

## 🔄 Fluxo Obrigatório para Agentes de IA a Cada Tarefa

> [!IMPORTANT]
> **NUNCA** faça commits ou `git push` diretamente nas branches `release` ou `develop`.  
> Siga rigorosamente os 6 passos abaixo ao receber qualquer instrução:

### 1. Início da Tarefa — Atualizar e Criar Branch
Antes de alterar qualquer código, garanta que a branch `develop` está limpa e crie a branch de trabalho:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade
# ou fix/nome-da-correcao, refactor/nome-do-modulo, etc.
```

### 2. Validação Local Pré-Commit
Antes de commitar, certifique-se de que a compilação passa com código de saída 0:
```bash
npm run build
```

### 3. Commit com Conventional Commits v1.0.0
Todos os commits DEVEM seguir o padrão Conventional Commits:
```
<tipo>[escopo opcional]: <descrição curta no imperativo>

[corpo opcional detalhando a motivação e mudanças]

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

#### Exemplos Válidos:
```bash
git commit -m "feat(cms): adicionar bloco de depoimentos no construtor de missoes"
git commit -m "fix(header): corrigir alinhamento do dropdown de acoes no mobile"
git commit -m "docs(agents): documentar git flow e conventional commits"
```

### 4. Push da Branch da Tarefa
Envie a branch criada para o repositório remoto:
```bash
git push -u origin feature/nome-da-funcionalidade
```

### 5. Abertura do Pull Request para `develop`
Ao concluir a instrução, abra automaticamente o PR com destino à branch `develop`:
```bash
gh pr create --base develop --head feature/nome-da-funcionalidade \
  --title "tipo(escopo): resumo da entrega" \
  --body "Descrição clara das alterações realizadas..."
```

### 6. Promoção para Produção (`develop` &rarr; `release`)
Quando uma versão for consolidada e validada em staging, uma release é promovida de `develop` para `release` via Pull Request:
```bash
gh pr create --base release --head develop \
  --title "release: v1.X.X - resumo das entregas" \
  --body "Changelog detalhado das funcionalidades prontas para produção."
```

---

## 🏛️ Contexto Institucional do Projeto

- **Organização:** Associação Humanitária Amor em Ação
- **CNPJ Oficial:** `21.960.082/0001-96`
- **Sede:** Rua Tocantins, nº 30 — Jardim Gramacho, Duque de Caxias/RJ
- **Domínio Oficial de Produção:** [https://amoremacao.lagrotti.dev](https://amoremacao.lagrotti.dev)
- **Créditos do Desenvolvedor (Permanente em Metadados e Rodapé):**  
  **Yago Lagrotti Bracco** ([https://lagrotti.dev](https://lagrotti.dev))  
  *Esta menção de crédito é um requisito permanente do projeto e NÃO deve ser alterada ou removida.*

---

## 🧱 Arquitetura e Tecnologias

- **Framework:** Next.js 15 (App Router) com React 19 e TypeScript
- **Estilização:** Tailwind CSS v4 + FontAwesome 6 + Google Fonts (`DM Sans` e `Manrope`)
- **Banco de Dados & Storage:** Supabase (PostgreSQL + RLS + Storage)
- **Meios de Pagamento:** Stripe Checkout (sem webhooks complexos)
- **Editor WYSIWYG de Blog:** `@milkdown/crepe` (mesmo padrão editorial do portfólio do desenvolvedor)
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
- Autentica via **Supabase Auth** (`supabase.auth.signInWithPassword`) ou variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

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
