src/ 
│
├── components/ 
│   ├── ButtonTabBar.tsx = É a barra de navegação com cinco abas
│   ├── LockButton.tsx = define o periodo que vai bloquear os aplicativos e insere um codigo para iniciar o bloqueio, tem uma contagem regressiva e usa AsyncStorage
│   └── VideoCard.tsx = Mostra os cards de videos e abre a URL deles
│
├── context/ 
│   └── AuthContext.tsx = guarda o user e seu role com asyncservice
│
├── navigation/ 
│   └── AppNavigator.tsx = define a navegação do projeto
│
├── screens/ 
│   ├── AppsScreen.tsx = tela de tempo em aplicativos
│   ├── ChartScreen.tsx = tela de graficos de gastos
│   ├── ChatScreen.tsx = tela de chat
│   ├── HomeScreen.tsx = tela inicial home
│   ├── LoginScreen.tsx = tela para fazer o login
│   ├── LoginSelectionScreen.tsx = tela para escolher como vai entrar
│   └── VideosScreen.tsx = tela de aprendizado com videos
│
├── storage/ 
│   └── AsyncService.ts = 
│
├── styles/ 
│   └── globalStyles.ts = estilo global
│
├── types/ 
│   └── index.ts = tipa para typescript
| 