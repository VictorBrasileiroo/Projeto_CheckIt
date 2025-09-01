# TodoList Sootz 📝

Uma aplicação web moderna de gerenciamento de tarefas com autenticação, drag & drop e sincronização em tempo real.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Cloud Firestore
- **Drag & Drop**: @dnd-kit
- **Roteamento**: React Router DOM
- **Build**: Vite
- **Deploy**: Firebase Hosting

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

## 🎯 Como Usar

1. **Cadastre-se** ou **faça login** com seu email
2. **Crie tarefas** com título e descrição opcional
3. **Use os filtros** para visualizar tarefas por status
4. **Arraste e solte** tarefas entre as zonas de status
5. **Edite** clicando no botão "Editar"
6. **Exclua** tarefas que não precisa mais

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Deploy no Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
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

---

⭐ Se este projeto te ajudou, deixe uma estrela no repositório!
