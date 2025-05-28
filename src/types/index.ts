export type Role = 'user' | 'family' | 'psychologist';
export interface User {
  email: string;
  role: Role;
}
export interface Message {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'other';
}
export interface AppItem {
  id: string;
  name: string;
  usage: string;
  locked: boolean;
}
export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}
export interface LearningVideo {
  id: string;
  title: string;
  url: string;
  status: {
    watched: boolean;
    locked: boolean;
  };
}

export type RootStackParamList = {
  LoginSelection: undefined;
  Login: { role: Role }; 
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}