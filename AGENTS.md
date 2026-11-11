# AGENTS.md — Diretrizes de Desenvolvimento e Governança para Agentes de IA

Este documento define o contexto, as regras arquiteturais e o **fluxo de trabalho obrigatório** para qualquer agente de IA ou desenvolvedor atuando no repositório da **Associação Humanitária Amor em Ação**.

---

## 🚨 REGRA DE OURO: FLUXO GIT & BRANCHES (OBRIGATÓRIO)

O projeto adota uma estratégia estrita de dois ramos no GitHub:

1. **`main`**: Branch de produção estável. Está conectada aos deploys de produção da Vercel (`https://amoremacao.lagrotti.dev`).
2. **`preview`**: Branch de desenvolvimento contínuo e staging.

### Comportamento Estrito para Agentes:
> [!IMPORTANT]
> - **NUNCA** faça commits ou `git push` direto na branch `main`.
> - **SEMPRE** trabalhe e envie seus commits para a branch `preview`.
> - **SEMPRE** valide a compilação local com `npm run build` antes de enviar.
> - Ao finalizar qualquer instrução ou conjunto de alterações, o agente DEVE **automaticamente**:
>   1. Comitar as alterações na branch `preview`:
>      ```bash
>      git add .
>      git commit -m "tipo: descrição clara do que foi feito"
>      git push origin preview
>      ```
>   2. Abrir um Pull Request (PR) da branch `preview` para a `main` via GitHub CLI:
>      ```bash
>      gh pr create --base main --head preview --title "tipo: resumo da alteração" --body "Descrição detalhada das mudanças realizadas..."
>      ```
>   *(Caso o PR já esteja aberto de uma instrução anterior, sincronize a branch `preview` e atualize o PR existente).*

---

## 🏛️ Contexto Institucional do Projeto

- **Organização:** Associação Humanitária Amor em Ação
- **CNPJ Oficial:** `21.960.082/0001-96`
- **Sede:** Rua Tocantins, nº 30 — Jardim Gramacho, Duque de Caxias/RJ
- **Domínio de Produção:** [https://amoremacao.lagrotti.dev](https://amoremacao.lagrotti.dev)
- **Créditos do Desenvolvedor (Rodapé e Metadados):**  
  **Yago Lagrotti Bracco** ([https://lagrotti.dev](https://lagrotti.dev))  
  *Esta menção de crédito é um requisito permanente do projeto e NÃO deve ser alterada ou removida.*

---

## 🧱 Arquitetura e Tecnologias

- **Framework:** Next.js 15 (App Router) com React 19 e TypeScript
- **Estilização:** Tailwind CSS v4 + FontAwesome 6 + Google Fonts (`DM Sans` e `Manrope`)
- **Banco de Dados & Storage:** Supabase (PostgreSQL + RLS + Storage)
- **Meios de Pagamento:** Stripe Checkout (Doações pontuais e recorrentes sem necessidade de webhooks complexos)
- **Editor WYSIWYG de Blog:** `@milkdown/crepe` (mesmo padrão editorial do portfólio)retomavenda
- **SEO & Dados Estruturados:** Schema.org JSON-LD (`NGO`, `WebSite`, `Article`, `ItemList`, `BreadcrumbList`)

---

## 📋 Regras de Implementação por Módulo

### 1. Construtor de Missões / Ações ("Elementor" Simplificado)
- O dropdown **"Nossas ações"** no cabeçalho exibe dinamicamente as **3 missões mais recentes** cadastradas.
- As páginas isoladas de cada missão rodam na rota dinâmica `/acoes/[slug]`.
- O construtor suporta blocos modulares nativos:
  - `hero`: Título, subtítulo, kicker, botões primário e secundário.
  - `image_text`: Imagem lateral (esquerda ou direita), parágrafos, tópicos e botão.
  - `text`: Texto livre em Markdown GFM.
  - `gallery`: Galeria de fotos com legenda, data e grid de 2, 3 ou 4 colunas.
  - `cards`: Grade de caixas de pilares com ícones FontAwesome.
  - `stats`: Contadores e métricas de impacto.
  - `quote`: Citação destacada ou nota de apuração.
  - `cta`: Chamada para ação com botões de doação ou voluntariado.
  - `contact`: Localização, Instagram e fontes externas.

### 2. Portal da Transparência
- Gerido dinamicamente pelo painel administrativo (`/admin`).
- Suporta 4 categorias oficiais:
  1. *Documentos Institucionais & Estatuto* (`institucional`)
  2. *Balanços & Demonstrações Financeiras* (`financeiro`)
  3. *Relatórios de Atividades & Impacto* (`atividades`)
  4. *Fontes Públicas & Registros de Mídia* (`fontes`)
- Permite vincular links diretos para PDFs, visualizações ou órgãos oficiais.

### 3. Blog & Qualidade Editorial
- Padrão WYSIWYG Milkdown Crepe idêntico ao portfólio do desenvolvedor.
- Cards do blog possuem **Pill da Imagem** e **Texto do Botão CTA** totalmente personalizáveis pelo administrador.
- Leitura estruturada: tempo estimado, sumário automático (H2/H3), modo leitura sem distrações, síntese de voz (áudio) e âncoras permanentes de parágrafos.
- **Zero dados simulados ("lixo"):** nenhuma lista estática falsa ou arquivos de seed mockados no repositório.

### 4. Autenticação Administrativa (`/admin`)
- Protegida por cookie de sessão seguro (`HttpOnly`, HMAC-SHA256).
- Autentica via **Supabase Auth** (`supabase.auth.signInWithPassword`) ou variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
- Rotas de API mutativas (`POST`, `PUT`, `DELETE`, `PATCH`) exigem validação de sessão administrativa.

---

## 🛠️ Comandos de Verificação

Sempre execute e certifique-se de que a compilação passe com código de saída 0:

```bash
# Instalação limpa
npm install

# Verificação de tipos e compilação de produção
npm run build

# Execução local
npm run dev
```
