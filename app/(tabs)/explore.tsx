import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import * as NavigationBar from 'expo-navigation-bar';

import Toast from 'react-native-toast-message';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Image,
  Platform,
  View,
  Button, 
  Alert,
  TextInput,
  Modal
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useState } from 'react';

export default function HomeScreen() {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#121212" : "#ffffff",
    flex: 1
  };

  NavigationBar.setBackgroundColorAsync(backgroundStyle.backgroundColor);
  NavigationBar.setBorderColorAsync(backgroundStyle.backgroundColor);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  }

  const [isModalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = () => {
    console.log('Number:', number);
    console.log('Password:', password);
    // 在此处添加确认逻辑
    toggleModal();
  };
  
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
      <Text style={styles.text}>1234</Text>
      <Button
      title='Show toast'
      onPress={showToast}
    />
    <View style={styles.container}>
      <Button title="Show Modal" onPress={toggleModal} />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>Enter Number:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={number}
            onChangeText={setNumber}
            placeholder="Enter a number"
          />

          <Text>Enter Password:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />

          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Cancel" onPress={toggleModal} color="red" />
        </View>
      </Modal>
    </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingTop: 20
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
});
