## Sobre o Projeto
Este é um aplicativo mobile desenvolvido em React Native para agendamento de consultas médicas. O sistema permite que pacientes visualizem médicos disponíveis, agendem consultas e gerenciem seus compromissos médicos de forma simples e intuitiva.

### Funcionalidades Principais
- Visualização de médicos disponíveis
- Agendamento de consultas
- Gerenciamento de consultas (visualizar, editar, cancelar)
- Interface intuitiva e responsiva
- Persistência de dados local
- Validação de datas e horários
- Seleção de médicos por especialidade

## Tecnologias Utilizadas
- [React Native](https://reactnative.dev/) - Framework para desenvolvimento mobile
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [Styled Components](https://styled-components.com/) - Estilização com CSS-in-JS
- [React Navigation](https://reactnavigation.org/) - Navegação entre telas
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Armazenamento local
- [React Native Elements](https://reactnativeelements.com/) - Biblioteca de componentes UI

## Pré-requisitos
Antes de começar, você precisa ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (para desenvolvimento Android)
- [Xcode](https://developer.apple.com/xcode/) (para desenvolvimento iOS, apenas em macOS)

## Instalação
npm install
npx expo start

## Estrutura do Projeto
src/
├── components/     # Componentes reutilizáveis
│   ├── Header/    # Componente de cabeçalho
│   └── AppointmentForm/  # Formulário de agendamento
├── screens/        # Telas do aplicativo
│   ├── HomeScreen.tsx
│   └── CreateAppointmentScreen.tsx
├── styles/         # Estilos globais e tema
│   └── theme.ts
├── types/          # Definições de tipos TypeScript
│   ├── appointments.ts
│   ├── doctors.ts
│   └── navigation.ts
└── utils/          # Funções utilitárias
