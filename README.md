# CheckIt 📝

Uma aplicação web moderna de gerenciamento de tarefas com autenticação, drag & drop e sincronização em tempo real.

## 🌐 Demo Online

🔗 **Aplicação em Produção**: [https://todolistsootz.web.app/](Clique aqui!)

> Deploy automatizado via Firebase Hosting com Github integrado

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS + Responsive Design
- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Cloud Firestore
- **Drag & Drop**: @dnd-kit
- **Roteamento**: React Router DOM v6
- **Build**: Vite 
- **Deploy**: Firebase Hosting + CDN Global
- **CI/CD**: GitHub Actions

## ✨ Funcionalidades

### Autenticação
- [x] Login com email e senha
- [x] Login com Google OAuth
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
git clone https://github.com/VictorBrasileiroo/CheckIt.git
cd ToDoList_Sootz
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Email/Password + Google)
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
│   ├── Layout/
│   │   ├── Dashboard.tsx
│   │   └── LandingPage.tsx
│
├── contexts/
│   └── AuthContext.tsx
│
├── services/
│   ├── Firebase.tsx
│   ├── TodoService.tsx
│   └── testTodoService.tsx
│
├── types/
│   └── index.ts
│
└── App.tsx


```

## 🧪 Testes

Este projeto utiliza **Vitest** como framework de testes, oferecendo uma experiência rápida e moderna para testes unitários e de integração.

### Cobertura Atual

- ✅ **TodoService** - 11 testes unitários
  - Criação de tarefas (`add`)
  - Atualização de conteúdo (`updateContent`) 
  - Mudança de status (`updateStatus`)
  - Exclusão (`delete`)
  - Movimentação entre colunas (`moveToStatus`)
  - Listener em tempo real (`subscribe`)

### Como Executar os Testes
```bash
npm run test:run
```

## 🔥 Recursos Avançados

- **Drag & Drop Inteligente** – Movimente itens com facilidade e precisão.  
- **Filtros Dinâmicos** – Encontre rapidamente o que precisa com filtros personalizáveis.  
- **Edição Inline** – Edite conteúdos diretamente sem abrir novas janelas.  
- **Sincronização em Tempo Real** – Alterações instantaneamente refletidas para todos os usuários.  
- **Responsividade Mobile** – Experiência otimizada em qualquer dispositivo.  

## 🎯 Como Usar

1. **Cadastre-se** ou **faça login** com seu email (ou use Google)
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

**URL da Aplicação**: [https://todolistsootz.web.app/](Clique aqui!)

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
- LinkedIn: [Victor Brasileiro](https://linkedin.com/in/victorbrasileirooo)
- Portfolio: [Acesse a aplicação](https://portifoliovictorbrasileiroo.netlify.app/)

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

**🚀 Acesse a aplicação**: [https://todolistsootz.web.app/](https://todolistsootz.web.app/)
