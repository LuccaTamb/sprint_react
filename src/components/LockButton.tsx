// src/screens/LockScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const STORAGE_KEYS = {
  LOCKED: "LOCKED",
  UNLOCK_TIMESTAMP: "UNLOCK_TIMESTAMP",
  SECURITY_CODE: "SECURITY_CODE",
};

export default function LockScreen() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [userCodeInput, setUserCodeInput] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateRemainingTime = async () => {
    const unlockAtStr = await AsyncStorage.getItem(
      STORAGE_KEYS.UNLOCK_TIMESTAMP
    );
    const unlockAt = unlockAtStr ? parseInt(unlockAtStr) : 0;
    const now = Date.now();
    const remaining = Math.floor((unlockAt - now) / 1000);

    if (remaining > 0) {
      setLocked(true);
      setLockTimeLeft(remaining);
    } else {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      setLocked(false);
      setLockTimeLeft(0);
    }
  };

  useEffect(() => {
    updateRemainingTime();
  }, []);

  useEffect(() => {
    if (locked) {
      timerRef.current = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setLocked(false);
            AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [locked]);

  const generateCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleConfirm = async () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds < 10) {
      Alert.alert("Tempo inválido", "Use no mínimo 10 segundos.");
      return;
    }

    const code = generateCode();
    setSecurityCode(code);
    setShowModal(true);
  };

  const verifyCodeAndLock = async () => {
    if (userCodeInput !== securityCode) {
      Alert.alert("Erro", "Código incorreto");
      return;
    }

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    const unlockAt = Date.now() + totalSeconds * 1000;

    setLocked(true);
    setLockTimeLeft(totalSeconds);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.LOCKED, "true"],
      [STORAGE_KEYS.UNLOCK_TIMESTAMP, unlockAt.toString()],
      [STORAGE_KEYS.SECURITY_CODE, securityCode],
    ]);
    setShowModal(false);
    setUserCodeInput("");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h} | ${m} | ${s}`;
  };

  return (
    <>
      <View style={styles.row}>
        <FontAwesome
          name={locked ? "lock" : "unlock"}
          size={24}
          color={locked ? "red" : "green"}
          style={styles.icon}
        />
        {locked ? (
          <Text style={styles.timer}>{formatTime(lockTimeLeft)}</Text>
        ) : (
          <>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
              placeholder="HH"
              maxLength={2}
            />
            <Text style={styles.sep}>|</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={minutes}
              onChangeText={setMinutes}
              placeholder="MM"
              maxLength={2}
            />
            <Text style={styles.sep}>|</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={seconds}
              onChangeText={setSeconds}
              placeholder="SS"
              maxLength={2}
            />
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Código de Segurança:</Text>
            <Text style={styles.code}>{securityCode}</Text>
            <Text style={styles.label}>Digite o código:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userCodeInput}
              onChangeText={setUserCodeInput}
              maxLength={6}
              placeholder="Código"
            />
            <Pressable style={styles.button} onPress={verifyCodeAndLock}>
              <Text style={styles.buttonText}>Validar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    minWidth: 50,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sep: {
    fontSize: 18,
    marginHorizontal: 4,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff3333',
  },
  icon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});
