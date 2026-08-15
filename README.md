# Meridian — Painel de Demandas Profissionais e Pessoais

Aplicação web para gerenciamento diário de demandas profissionais (prazos, solicitantes,
responsáveis, anexos) e da rotina pessoal (agenda, estudos, atividades recorrentes),
com dados sincronizados entre dispositivos via Supabase.

## Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Estilo**: Tailwind CSS (paleta em tons de azul-marinho, tipografia Times New Roman)
- **Backend / dados**: Supabase (Auth, PostgreSQL, Storage, Row Level Security)
- **Roteamento**: React Router
- **Hospedagem**: Netlify (plano gratuito)

## Funcionalidades

### Autenticação
- Cadastro, login, logout e recuperação de senha via Supabase Auth
- Todas as páginas internas são protegidas; nenhum dado é acessível sem login
- Row Level Security garante que cada usuário veja apenas seus próprios dados

### Dashboard
- Indicadores de demandas profissionais (total, pendentes, em andamento, concluídas, atrasadas)
- Indicadores de atividades pessoais (hoje, pendências, concluídas hoje, próximas)
- Seção "Próximos prazos" combinando profissional e pessoal
- Seção "Atividades de hoje"

### Área profissional
- Cadastro de demandas: título, descrição, solicitante, responsável, datas, prioridade,
  status e anexos
- Anexos armazenados no Supabase Storage (PDF, Excel, Word, imagens, etc.), com
  visualizar/baixar/remover
- Tabela (desktop) e cards (mobile) com checkbox de conclusão, sem excluir o histórico
- Cálculo automático de prazo vencido ("Atrasada") comparando com a data atual —
  nunca depende do usuário marcar manualmente
- Filtros por status, prioridade, responsável, solicitante; busca por texto; ordenação

### Área pessoal
- Agenda + lista de tarefas + organização de estudos (não é uma cópia da área profissional)
- Cadastro de atividades com categoria, data, horário, prioridade, status e anexos
- Atividades recorrentes (diária, semanal com dias da semana configuráveis, mensal)
- "Agenda de hoje" com horários
- Calendário com visualização por dia, semana e mês
- Mini dashboard de estudos com indicadores por categoria (AWS, inglês, espanhol, etc.)

### Experiência
- Layout responsivo (desktop, notebook, tablet, celular) com sidebar que vira menu no mobile
- Notificações visuais (toasts) para cada ação: criar, editar, excluir, concluir, anexar
- Atualização imediata da interface e dos indicadores após qualquer alteração

## Estrutura do projeto

```
src/
  components/
    layout/       Sidebar, Header, AppLayout, AuthShell
    ui/            Button, Input, Select, Checkbox, Modal, Card, FileUpload, Toast...
    tasks/         Formulário, tabela e filtros da área profissional
    personal/      Formulário, agenda, calendário e dashboard de estudos
    dashboard/     Cards de indicadores, próximos prazos, atividades de hoje
  contexts/        AuthContext, ToastContext
  hooks/           useProfessionalTasks, usePersonalActivities, useAttachments
  lib/             Cliente Supabase
  pages/           Login, Cadastro, Dashboard, Profissional, Pessoal, Configurações, Perfil
  router/          Proteção de rotas autenticadas
  types/           Tipos TypeScript compartilhados
  utils/           Datas, cálculo de prazos, recorrência
supabase/
  schema.sql       Script completo de criação de tabelas, RLS e bucket de storage
```

## Como instalar e executar localmente

### Pré-requisitos
- Node.js 20 ou superior
- Uma conta gratuita no [Supabase](https://supabase.com)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-seu-repositorio>
cd meridian-dashboard
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com) (plano gratuito)
2. No painel do projeto, vá em **SQL Editor** → **New query**
3. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) e execute
   — isso cria as tabelas `professional_tasks`, `personal_activities`, `attachments`,
   as políticas de RLS e o bucket `attachments` no Storage
4. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon public key**

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores copiados do Supabase:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
```

> **Nunca** commite o arquivo `.env` — ele já está no `.gitignore`.

### 4. Executar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`, crie uma conta e comece a usar.

### 5. Gerar o build de produção

```bash
npm run build
```

Os arquivos otimizados são gerados em `dist/`. Para testar localmente:

```bash
npm run preview
```

## Como publicar na Netlify (gratuito)

1. Suba o projeto para um repositório no GitHub (veja seção abaixo)
2. Em [app.netlify.com](https://app.netlify.com), clique em **Add new site → Import an
   existing project**
3. Conecte sua conta do GitHub e selecione o repositório
4. A Netlify detecta automaticamente as configurações do arquivo `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Antes de publicar, adicione as variáveis de ambiente em **Site settings → Environment
   variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Clique em **Deploy site**

O arquivo `netlify.toml` (e o `public/_redirects` como reforço) já garante que as rotas
do React Router funcionem corretamente ao atualizar a página ou acessar uma URL direta
(ex.: `seusite.netlify.app/profissional`).

## Como colocar no GitHub

```bash
git init
git add .
git commit -m "Meridian: painel de demandas profissionais e pessoais"
git branch -M main
git remote add origin <url-do-seu-repositorio>
git push -u origin main
```

O `.gitignore` já impede que `node_modules`, `dist` e `.env` sejam enviados ao
repositório.

## Segurança

- Nenhuma credencial (senha, chave secreta, Service Role Key) é usada no frontend —
  apenas a **anon public key**, que é segura para uso em aplicações client-side quando
  combinada com Row Level Security
- RLS garante isolamento total dos dados entre usuários, inclusive nos arquivos do Storage
- Arquivos anexados ficam em um bucket privado; o acesso é feito por links assinados
  temporários (5 minutos), gerados sob demanda

## Limitações conhecidas e próximos passos

Itens fora do escopo inicial, mas com a arquitetura preparada para evolução futura:

- **Notificações por e-mail**: hoje as notificações são apenas visuais (toasts dentro do
  app). Para adicionar e-mails, pode-se usar Supabase Edge Functions + um provedor de
  e-mail transacional (ex.: Resend), disparado por triggers no banco de dados
- **Edição de uma única ocorrência de uma série recorrente**: atualmente, atividades
  recorrentes são geradas como registros independentes ligados por
  `recurrence_group_id`; cada ocorrência já pode ser editada ou excluída isoladamente
  sem afetar as demais, mas não há ainda uma opção de "editar todas as ocorrências
  futuras de uma vez" — o `recurrence_group_id` foi incluído no schema justamente para
  viabilizar essa função no futuro
- **Modo offline**: não implementado; o app depende de conexão com o Supabase

## Verificações antes do deploy

- [x] O projeto inicia corretamente localmente (`npm run dev`)
- [x] O build funciona sem erros (`npm run build`)
- [x] Autenticação (login, cadastro, logout, recuperação de senha) via Supabase Auth
- [x] Dados persistidos no Supabase (PostgreSQL), sem uso de localStorage como
      mecanismo principal
- [x] Row Level Security configurada em todas as tabelas e no bucket de Storage
- [x] Upload, visualização, download e remoção de anexos funcionam via Supabase Storage
- [x] Calendário com visualização por dia, semana e mês
- [x] Configuração de SPA (`netlify.toml` + `_redirects`) para rotas funcionarem após
      deploy
- [x] Nenhuma credencial secreta no código-fonte (apenas variáveis de ambiente)
- [x] `.env` fora do controle de versão
