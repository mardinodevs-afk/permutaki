# PermutAKI — Facilitando a sua transferência por permuta

## Visão Geral

PermutAKI é uma plataforma web gratuita concebida para funcionários públicos moçambicanos encontrarem parceiros compatíveis para transferências de localização por permuta. A aplicação permite que os utilizadores criem perfis com informação profissional e localizações atuais/desejadas, procurem parceiros compatíveis e comuniquem de forma segura para combinar as trocas.

A plataforma enfatiza acessibilidade para utilizadores em Moçambique, prevenção de fraudes através de um sistema de denúncias e confiança da comunidade através de um mecanismo de avaliações. Opera como uma iniciativa pessoal independente (não é uma plataforma governamental) e depende do apoio da comunidade.

## Preferências do Utilizador

Estilo de comunicação preferido: linguagem simples e do dia-a-dia.

## Arquitectura do Sistema

### Tipo de Aplicação
Aplicação full-stack em monorepositório com:
- **Frontend**: React + TypeScript com o Vite como ferramenta de construção
- **Backend**: API REST com Express.js
- **Base de dados**: PostgreSQL (Neon serverless) usando Drizzle ORM
- **UI Framework**: componentes Shadcn/ui com Tailwind CSS
- **Routing**: Wouter para navegação no cliente

### Arquitectura do Frontend

**Estrutura de Componentes:**
- Componentes a nível de página: `LandingPage`, `UserDashboard`, `AdminDashboard`
- Componentes de funcionalidades: modais de registo/login, cartões de utilizador, interfaces de pesquisa
- Componentes UI partilhados: biblioteca Shadcn/ui em `/client/src/components/ui/`
- O sistema de design segue padrões profissionais inspirados no LinkedIn/WhatsApp, com atenção à acessibilidade de portais públicos

**Gestão de Estado:**
- Hooks do React para estado local
- TanStack Query (React Query) para estado do servidor e cache
- Tokens JWT guardados em localStorage para autenticação

**Abordagem de Estilo:**
- Tailwind CSS (utility-first)
- Tokens de design personalizados definidos em variáveis CSS (sistema HSL)
- Suporte a modo claro/escuro com alternador de tema
- Design responsivo, mobile-first

### Arquitectura do Backend

**Estrutura da API:**
- Endpoints REST sob o prefixo `/api/`
- Middleware de autenticação baseado em JWT
- Middleware de autorização para rotas administrativas
- Gestão de sessão com verificação de token

**Endpoints Principais:**
- Registo e autenticação de utilizadores
- Gestão de perfil (visualizar, actualizar, eliminar)
- Pesquisa de utilizadores com filtros (localização, sector, nível salarial)
- Gestão de contactos (controlo de contactos via WhatsApp com limites diários)
- Sistema de avaliações e denúncias
- Operações administrativas (gestão de utilizadores, promoção a premium, banimentos)
- Fluxo de redefinição de password (pedido e reposição com tokens gerados por admin)

**Medidas de Segurança:**
- bcrypt para hashing de passwords
- JWT com chave secreta para autenticação
- Limitação de taxa para contactos WhatsApp (5/dia gratuito, 20/dia premium)
- Verificação administrativa para redefinições de password
- Validação de entrada com esquemas Zod

### Desenho da Base de Dados

**Tabelas Principais:**
- `users`: perfis de funcionários públicos com dados pessoais, profissionais, de localização e autenticação
- `reports`: denúncias/submissões de fraude ou abuso pelos utilizadores
- `ratings`: sistema de avaliações entre utilizadores
- `locationHistory`: histórico de alterações de localização do perfil

**Campos Principais do Utilizador:**
- Pessoais: firstName, lastName
- Profissionais: sector, salaryLevel (1-21), grade (A/B/C)
- Localização: currentProvince/District, desiredProvince/District
- Estado da conta: isActive, isPremium, isAdmin, isBanned, permutationCompleted
- Limites de contacto: whatsappContactsToday, lastContactReset

**Camada de Dados:**
- Drizzle ORM para consultas tipadas à base de dados
- PostgreSQL serverless (Neon) em produção
- Sistema de migrações via drizzle-kit

### Fluxo de Autenticação

1. O utilizador regista-se com número de telefone e password
2. O servidor faz hash da password com bcrypt e gera um token JWT
3. O token é guardado em localStorage e incluído no cabeçalho Authorization
4. Middleware valida o token nas rotas protegidas
5. A redefinição de password requer um token gerado por um administrador e enviado via WhatsApp

### Tipos de Utilizador e Permissões

**Utilizadores Gratuitos:**
- Criar e editar perfil
- Procurar combinações
- Ver outros perfis
- 5 contactos WhatsApp por dia
- Avaliar e denunciar utilizadores

**Utilizadores Premium:**
- Todas as funcionalidades gratuitas
- 20 contactos WhatsApp por dia
- Visibilidade prioritária nas correspondências
- Promoção feita por admin com rastreio de expiração

**Administradores:**
- Gestão completa de utilizadores (activar, banir, eliminar, promover a premium)
- Monitorização do sistema (estatísticas, histórico de edições)
- Geração de tokens para redefinição de password
- Configuração da página de entrada e definições da aplicação

### Arquitectura por Funcionalidade

**Pesquisa e Correspondência:**
- Filtrar por província, distrito, sector, nível salarial, grau
- Algoritmo de correspondência prioritária que destaca correspondências recíprocas
- Resultados paginados e com cache

**Gestão de Contactos:**
- Limites diários de contacto são reiniciados à meia-noite
- Verificação do estado premium antes de permitir contactos adicionais
- Controlo de contactos para prevenir spam

**Avaliações e Denúncias:**
- Utilizadores podem avaliar parceiros após contacto
- Sistema de denúncias com revisão administrativa
- Utilizadores mal-intencionados podem ser banidos por administradores

**Actualizações de Perfil:**
- Rastreio do histórico de localização para auditoria
- Registo de timestamps de edição
- Verificações automatizadas de expiração de premium (tarefa horária)

### Dependências Externas

**Base de dados:**
- Neon PostgreSQL (serverless)
- Variável de ambiente: `DATABASE_URL`

**Autenticação:**
- JWT para autenticação baseada em token
- Variável de ambiente: `JWT_SECRET` (obrigatória para segurança)

**Bibliotecas de Componentes UI:**
- Shadcn/ui (Radix UI primitives)
- Tailwind CSS para estilos
- Lucide React para ícones

**Ferramentas de Construção e Desenvolvimento:**
- Vite para build e dev server do frontend
- esbuild para empacotamento do backend
- TypeScript para segurança de tipos
- Drizzle Kit para migrações de base de dados

**Bibliotecas de Frontend:**
- React 18+
- TanStack Query para fetch de dados
- React Hook Form para gestão de formulários
- Zod para validação
- Wouter para routing

**Bibliotecas de Backend:**
- Express.js como framework web
- bcryptjs para hashing de passwords
- jsonwebtoken para gestão de JWT
- ws (WebSocket) para ligação com Neon (quando necessário)

**Recursos de Design:**
- Google Fonts (inter)
- Imagens geradas em `/attached_assets/generated_images/`

**Dados Específicos de Moçambique:**
- Lista de províncias e distritos em `shared/mozambique-data.ts`
- Classificações de sector e grau para funcionários públicos
- Localização em Português em todas as interfaces
