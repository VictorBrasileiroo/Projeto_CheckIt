# TodoList Sootz 📝

Uma aplicação web moderna de gerenciamento de tarefas com autenticação, drag & drop e sincronização em tempo real.

## 🌐 Demo Online

🔗 **Aplicação em Produção**: [https://todolistsootz.web.app/](https://todolistsootz.web.app/)

> Deploy automatizado via Firebase Hosting com CI/CD integrado

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS + Responsive Design
- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Cloud Firestore (NoSQL)
- **Drag & Drop**: @dnd-kit (Biblioteca moderna)
- **Roteamento**: React Router DOM v6
- **Build**: Vite (Bundler ultrarrápido)
- **Deploy**: Firebase Hosting + CDN Global
- **CI/CD**: GitHub Actions (Automação)

## ✨ Funcionalidades

### Autenticação
- [x] Login com email e senha
- [x] Cadastro de novos usuários
- [x] Logout seguro
- [x] Sessões persistentes
- [x] Acesso restrito por usuário

### Gerenciamento de Tarefas
- [x] **Criar** novas tarefas com título e descrição
- [x] **Visualizar** tarefas em tempo real
- [x] **Editar** tarefas existentes (título e descrição)
- [x] **Excluir** tarefas
- [x] **Alterar status**: A Fazer → Em Progresso → Concluído

### Interface e UX
- [x] Drag & Drop para reordenar tarefas
- [x] Filtros por status (Todas, A Fazer, Em Progresso, Concluídas)
- [x] Interface responsiva (Desktop e Mobile)
- [x] Feedback visual para todas as ações
- [x] Design moderno com tema escuro

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Firebase

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/VictorBrasileiroo/ToDoList_Sootz.git
cd ToDoList_Sootz
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Email/Password)
   - Ative Cloud Firestore
   - Copie as configurações do Firebase
   - Crie o arquivo `src/services/firebaseConfig.js` com suas configurações

4. **Configure as regras do Firestore**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{document} {
      allow read, write: if resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

5. **Execute o projeto**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── AuthSecurity.tsx
│   └── Layout/
│       └── Dashboard.tsx
├── contexts/
│   └── AuthContext.tsx
├── services/
│   ├── Firebase.tsx
│   └── TodoService.tsx
├── types/
│   └── Index.tsx
└── App.tsx
```

## 🔥 Recursos Avançados

### Drag & Drop Inteligente
- Arrastar tarefas entre zonas de status
- Feedback visual durante o arraste
- Animações suaves

### Filtros Dinâmicos
- Visualização por status
- Contadores em tempo real
- Interface intuitiva

### Edição Inline
- Editar tarefas sem sair da lista
- Salvar com Enter ou Ctrl+Enter
- Cancelar com Esc

### Sincronização em Tempo Real
- Mudanças instantâneas entre dispositivos
- Listener do Firestore
- Estado sempre atualizado

### Responsividade Mobile
- Layout otimizado para dispositivos móveis
- Touch gestures para drag & drop
- Interface adaptativa

## 📊 Performance e Otimizações

### 🚀 Otimizações Implementadas
- **Code Splitting**: Carregamento sob demanda
- **Tree Shaking**: Remoção de código não utilizado  
- **Minificação**: CSS e JavaScript otimizados
- **Gzip/Brotli**: Compressão de assets
- **CDN**: Firebase CDN global
- **Lazy Loading**: Componentes carregados quando necessário

### 📈 Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### 🛡️ Segurança
- **HTTPS**: Certificado SSL automático
- **Firestore Rules**: Acesso restrito por usuário
- **Authentication**: Firebase Auth seguro
- **CORS**: Configuração adequada de origem

## 🎯 Como Usar

1. **Cadastre-se** ou **faça login** com seu email
2. **Crie tarefas** com título e descrição opcional
3. **Use os filtros** para visualizar tarefas por status
4. **Arraste e solte** tarefas entre as zonas de status
5. **Edite** clicando no botão "Editar"
6. **Exclua** tarefas que não precisa mais

## 🚀 Deploy

### 🌐 Produção - Firebase Hosting

A aplicação está em produção no Firebase Hosting, oferecendo:
- ✅ HTTPS automático
- ✅ CDN global para alta performance
- ✅ Deploy contínuo
- ✅ Domínio personalizado disponível

**URL da Aplicação**: [https://todolist-sootz.web.app](https://todolist-sootz.web.app)

### 📦 Como Fazer Deploy

#### 1. Build para Produção
```bash
# Gerar build otimizado
npm run build
```

#### 2. Configurar Firebase Hosting

**Primeira vez (configuração inicial):**
```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Fazer login no Firebase
firebase login

# Inicializar projeto Firebase
firebase init hosting
```

**Durante a configuração:**
- ✅ Selecione seu projeto Firebase
- ✅ Public directory: `dist`
- ✅ Single-page app: `Yes`
- ✅ Rewrite all URLs to /index.html: `Yes`

#### 3. Deploy
```bash
# Deploy para produção
firebase deploy --only hosting

# Deploy com preview (opcional)
firebase hosting:channel:deploy preview

# Deploy com mensagem personalizada
firebase deploy --only hosting -m "Nova versão com melhorias"
```

#### 4. Verificar Deploy
```bash
# Ver histórico de deploys
firebase hosting:releases:list

# Ver informações do site
firebase hosting:sites:list
```

### 🔧 Configuração do Firebase (firebase.json)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 🚀 Deploy Alternativo - Outras Plataformas

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Faça upload da pasta 'dist' no Netlify
```

### 🔄 CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Victor Brasileiro**
- GitHub: [@VictorBrasileiroo](https://github.com/VictorBrasileiroo)
- LinkedIn: [Victor Brasileiro](https://linkedin.com/in/victorbrasileiro)
- Portfolio: [Acesse a aplicação](https://todolist-sootz.web.app)

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run preview         # Preview do build

# Firebase
firebase serve          # Testar localmente
firebase deploy         # Deploy para produção
firebase hosting:channel:deploy preview  # Deploy preview

# Manutenção
npm audit fix           # Corrigir vulnerabilidades
npm update             # Atualizar dependências
```

## 📚 Recursos Adicionais

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Guia do React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [DND Kit](https://dndkit.com)

---

⭐ Se este projeto te ajudou, deixe uma estrela no repositório!

**🚀 Acesse a aplicação**: [https://todolist-sootz.web.app](https://todolist-sootz.web.app)
