// src/screens/AppsScreen.tsx
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { useTheme } from "../styles/globalStyles";
import LockButton from "../components/LockButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

// Definir as chaves de armazenamento para o bloqueio global
const STORAGE_KEYS = {
  LOCKED: "LOCKED",
  TIME_LEFT: "TIME_LEFT",
  SECURITY_CODE: "SECURITY_CODE",
};

type AppItem = {
  id: string;
  name: string;
  usage: string;
  locked?: boolean;
};

export default function AppsScreen({ navigation }) {
  const theme = useTheme();
  const [apps, setApps] = useState<AppItem[]>([]);
  const { role } = useAuth();
  const [securityCode, setSecurityCode] = useState("");
  const [userCodeInput, setUserCodeInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  useEffect(() => {
    // Dados mockados com IDs únicos
    const mockApps: AppItem[] = [
      { id: "1", name: "Bet365", usage: "2h 37m" },
      { id: "2", name: "Betano", usage: "1h 19m" },
      { id: "3", name: "Superbet", usage: "0h 32m" },
      { id: "4", name: "KTO", usage: "1h 56m" },
      { id: "5", name: "Sportingbet", usage: "0h 06m" },
      { id: "6", name: "F12 bet", usage: "1h 47m" },
      { id: "7", name: "Betnacional", usage: "0h 16m" },
    ];

    // Carregar estado de bloqueio dos apps individualmente
    const loadAppLocks = async () => {
      const appsWithLocks = await Promise.all(
        mockApps.map(async (app) => {
          const locked = await AsyncStorage.getItem(
            `appLocked_${app.id}_${role}`
          );
          return { ...app, locked: locked === "true" };
        })
      );
      setApps(appsWithLocks);
    };

    loadAppLocks();
  }, []);

  // Adicionar botão de bloqueio no header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.lockButton}
        >
          <FontAwesome name="lock" size={24} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleToggleLock = async (appId: string) => {
    const currentApp = apps.find((app) => app.id === appId);
    const newLocked = !currentApp?.locked;

    const updatedApps = apps.map((app) =>
      app.id === appId ? { ...app, locked: newLocked } : app
    );
    setApps(updatedApps);

    await AsyncStorage.setItem(
      `appLocked_${appId}_${role}`,
      newLocked.toString()
    );
  };

  // Função para gerar código
  const generateCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  // Verifica o código e bloqueia todos os apps
  const verifyCodeAndLockAll = async () => {
    if (userCodeInput !== securityCode) {
      Alert.alert("Erro", "Código incorreto");
      return;
    }

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds < 10) {
      Alert.alert("Tempo inválido", "Use no mínimo 10 segundos.");
      return;
    }

    try {
      // Bloquear globalmente
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.LOCKED, "true"],
        [STORAGE_KEYS.TIME_LEFT, totalSeconds.toString()],
        [STORAGE_KEYS.SECURITY_CODE, securityCode],
      ]);

      // Bloquear todos os apps individualmente
      const lockPromises = apps.map((app) =>
        AsyncStorage.setItem(`appLocked_${app.id}_${role}`, "true")
      );

      await Promise.all(lockPromises);

      // Atualizar estado local
      setApps((prevApps) => prevApps.map((app) => ({ ...app, locked: true })));

      setShowModal(false);
      setUserCodeInput("");
      setHours("");
      setMinutes("");
      setSeconds("");
      Alert.alert("Sucesso", "Todos os aplicativos foram bloqueados.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível bloquear os aplicativos");
      console.error("Erro ao bloquear apps:", error);
    }
  };

  // Iniciar o processo de bloqueio
  const startLockProcess = () => {
    const code = generateCode();
    setSecurityCode(code);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appItem}>
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                {item.name}
              </Text>
              <Text style={{ color: theme.colors.inactive }}>{item.usage}</Text>
            </View>
            <LockButton
              locked={item.locked || false}
              onToggle={() => handleToggleLock(item.id)}
            />
          </View>
        )}
      />

      {/* Modal para bloqueio total */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Defina o tempo de bloqueio</Text>

            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
                placeholder="HH"
                maxLength={2}
              />
              <Text style={styles.sep}>:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minutes}
                onChangeText={setMinutes}
                placeholder="MM"
                maxLength={2}
              />
              <Text style={styles.sep}>:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={seconds}
                onChangeText={setSeconds}
                placeholder="SS"
                maxLength={2}
              />
            </View>

            {!securityCode ? (
              <TouchableOpacity
                onPress={startLockProcess}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Gerar Código</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.label}>Código de Segurança:</Text>
                <Text style={styles.code}>{securityCode}</Text>

                <Text style={styles.label}>Digite o código:</Text>
                <TextInput
                  style={styles.largeInput}
                  keyboardType="numeric"
                  value={userCodeInput}
                  onChangeText={setUserCodeInput}
                  maxLength={6}
                  placeholder="Código"
                />

                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        userCodeInput === securityCode ? "red" : "gray",
                    },
                  ]}
                  disabled={userCodeInput !== securityCode}
                  onPress={verifyCodeAndLockAll}
                >
                  <Text style={styles.buttonText}>Validar e Bloquear</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  appItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  appInfo: {
    flex: 1,
    marginRight: 16,
  },
  appName: {
    fontSize: 16,
    fontWeight: "500",
  },
  lockButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,0,0,0.1)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  code: {
    fontSize: 24,
    color: "red",
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 40,
    textAlign: "center",
    padding: 4,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  largeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 200,
    textAlign: "center",
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  sep: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 2,
  },
});
