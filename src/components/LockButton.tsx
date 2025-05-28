// src/screens/LockScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Pressable,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const STORAGE_KEYS = {
  LOCKED: 'LOCKED',
  TIME_LEFT: 'TIME_LEFT',
  SECURITY_CODE: 'SECURITY_CODE',
};

export default function LockScreen() {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [userCodeInput, setUserCodeInput] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadStorage = async () => {
      const savedLocked = await AsyncStorage.getItem(STORAGE_KEYS.LOCKED);
      const savedTime = await AsyncStorage.getItem(STORAGE_KEYS.TIME_LEFT);
      const savedCode = await AsyncStorage.getItem(STORAGE_KEYS.SECURITY_CODE);
      if (savedLocked === 'true' && savedTime) {
        setLocked(true);
        setLockTimeLeft(Number(savedTime));
        setSecurityCode(savedCode || '');
      }
    };
    loadStorage();
  }, []);

  useEffect(() => {
    if (locked && lockTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setLockTimeLeft((prev) => {
          const next = prev - 1;
          AsyncStorage.setItem(STORAGE_KEYS.TIME_LEFT, next.toString());
          if (next <= 0) {
            clearInterval(timerRef.current!);
            setLocked(false);
            AsyncStorage.multiRemove([
              STORAGE_KEYS.LOCKED,
              STORAGE_KEYS.TIME_LEFT,
              STORAGE_KEYS.SECURITY_CODE,
            ]);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [locked]);

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleConfirm = async () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds < 10) {
      Alert.alert('Tempo inválido', 'Use no mínimo 10 segundos.');
      return;
    }

    const code = generateCode();
    setSecurityCode(code);
    setShowModal(true);
  };

  const verifyCodeAndLock = async () => {
    if (userCodeInput !== securityCode) {
      Alert.alert('Erro', 'Código incorreto');
      return;
    }

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    setLocked(true);
    setLockTimeLeft(totalSeconds);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.LOCKED, 'true'],
      [STORAGE_KEYS.TIME_LEFT, totalSeconds.toString()],
      [STORAGE_KEYS.SECURITY_CODE, securityCode],
    ]);
    setShowModal(false);
    setUserCodeInput('');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h} | ${m} | ${s}`;
  };

  return (
    <>
      <View style={styles.row}>
        <FontAwesome
          name={locked ? 'lock' : 'unlock'}
          size={24}
          color={locked ? 'red' : 'green'}
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
    padding: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 40,
    textAlign: 'center',
    padding: 4,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  sep: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  button: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  code: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
    marginVertical: 8,
  },
});
