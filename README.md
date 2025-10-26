# 🍳 App de Receitas

Um aplicativo móvel de receitas desenvolvido com React Native e Expo, que permite aos usuários descobrir, pesquisar e salvar receitas deliciosas de todo o mundo.

## ✨ Funcionalidades

- **Descoberta de Receitas**: Explore receitas aleatórias e populares
- **Pesquisa Avançada**: Busque receitas por nome, categoria ou ingrediente
- **Filtros por Categoria**: Navegue por diferentes tipos de comida (Vegetariana, Sobremesa, etc.)
- **Detalhes Completos**: Visualize ingredientes, instruções e informações nutricionais
- **Favoritos**: Salve suas receitas preferidas para acesso rápido
- **Interface Moderna**: Design responsivo e intuitivo com TailwindCSS
- **Autenticação**: Sistema de login e registro com Clerk

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento móvel
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática para JavaScript
- **Expo Router** - Roteamento baseado em arquivos
- **TailwindCSS** - Framework CSS utilitário
- **NativeWind** - TailwindCSS para React Native
- **Clerk** - Autenticação e gerenciamento de usuários
- **TheMealDB API** - API para dados de receitas

## 📱 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) (para testar no dispositivo móvel)

## 🚀 Como Executar

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd recipe-app/mobile
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**

   ```bash
   npx expo start
   ```

4. **Execute no dispositivo**
   - **Android**: Pressione `a` ou escaneie o QR code com o Expo Go
   - **iOS**: Pressione `i` ou escaneie o QR code com a câmera do iPhone
   - **Web**: Pressione `w` para abrir no navegador

## 📁 Estrutura do Projeto

```
mobile/
├── app/                    # Páginas da aplicação (Expo Router)
│   ├── (auth)/            # Telas de autenticação
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── verify-email.tsx
│   ├── (tabs)/            # Telas principais com navegação por abas
│   │   ├── index.tsx      # Tela inicial
│   │   ├── search.jsx     # Tela de pesquisa
│   │   └── favorites.tsx  # Tela de favoritos
│   └── _layout.tsx        # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── category-filter.tsx
│   ├── recipe-card.tsx
│   └── SafeScreen.tsx
├── services/              # Serviços e APIs
│   └── meal-api.ts        # Integração com TheMealDB API
├── assets/                # Recursos estáticos
│   ├── images/           # Imagens
│   └── styles/           # Estilos específicos
└── constants/            # Constantes da aplicação
    └── color.ts          # Paleta de cores
```

## 🔧 Scripts Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na Web
npm run web

# Executar linter
npm run lint

# Resetar projeto (cuidado!)
npm run reset-project
```

## 🌐 API Externa

Este aplicativo utiliza a [TheMealDB API](https://www.themealdb.com/api.php) para obter dados de receitas. A API oferece:

- Mais de 1000 receitas de diferentes países
- Informações detalhadas sobre ingredientes e instruções
- Categorias e filtros por ingredientes
- Receitas aleatórias para descoberta

## 🎨 Design System

O aplicativo utiliza uma paleta de cores consistente definida em `constants/color.ts`:

- **Primária**: Tons de laranja e vermelho para elementos principais
- **Secundária**: Tons de verde para elementos de apoio
- **Neutra**: Cinzas para textos e backgrounds

## 🔐 Autenticação

O sistema de autenticação é gerenciado pelo Clerk, oferecendo:

- Login e registro de usuários
- Verificação de email
- Recuperação de senha
- Sessões seguras

## 📱 Compatibilidade

- **Android**: 6.0+ (API level 23+)
- **iOS**: 11.0+
- **Web**: Navegadores modernos

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação do Expo](https://docs.expo.dev/)
2. Consulte os [issues do GitHub](https://github.com/expo/expo/issues)
3. Entre na [comunidade Discord do Expo](https://chat.expo.dev)

## 🎯 Próximos Passos

- [ ] Implementar sistema de avaliações
- [ ] Adicionar modo offline
- [ ] Integrar com redes sociais
- [ ] Implementar notificações push
- [ ] Adicionar lista de compras
- [ ] Sistema de comentários e reviews

---

Desenvolvido com ❤️ usando React Native e Expo
