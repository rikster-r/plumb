import { GeistText } from '@/components/GeistText';
import { useUser } from '@/context/currentUser';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // const handleSubmit = async () => {
  //   if (!email || !password) {
  //     Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const response = await fetch(
  //       'https://doctoronduty.vercel.app/api/auth/login',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           email, // ✅ email instead of phone_number
  //           password,
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       Alert.alert('Ошибка', data.error || 'Ошибка входа');
  //       return;
  //     }

  //     login(data.token, data.user);
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert('Ошибка', 'Произошла ошибка при входе');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      // fake token + user (like in UserProvider)
      const fakeToken = 'test-token';
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        fullName: 'Григорьев Анатолий Генадьевич',
        phone: '89161234567',
        role: 'Мастер',
        access: 'open',
      };

      await login(fakeToken, fakeUser);
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.formContainer}>
          <GeistText weight={700} style={styles.title}>
            Вход
          </GeistText>

          <View style={styles.inputGroup}>
            <GeistText
              style={[styles.label, isEmailFocused && styles.labelFocused]}
            >
              Email
            </GeistText>
            <TextInput
              style={[styles.input, isEmailFocused && styles.inputFocused]}
              placeholder="example@mail.com"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <GeistText
              weight={500}
              style={[styles.label, isPasswordFocused && styles.labelFocused]}
            >
              Пароль
            </GeistText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  isPasswordFocused && styles.inputFocused,
                ]}
                placeholder=""
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!email || !password || isLoading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!email || !password || isLoading}
          >
            <GeistText
              weight={600}
              style={[
                styles.submitButtonText,
                (!email || !password || isLoading) &&
                  styles.submitButtonTextDisabled,
              ]}
            >
              {isLoading ? 'Загрузка...' : 'Далее'}
            </GeistText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF4FD',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#374151',
  },
  labelFocused: {
    color: '#1D4ED8',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Geist-Regular',
  },
  inputFocused: {
    borderColor: '#3B82F6',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    fontSize: 14,
    color: '#1F2937',
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButtonTextDisabled: {
    color: '#6B7280',
  },
});

export default Login;
