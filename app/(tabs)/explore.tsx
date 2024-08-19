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
  Modal,
  Pressable
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// 存储数据
const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // 保存错误
  }
};

// 读取数据
const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value
    } else {
      return 'empty'
    }
  } catch (e) {
    return 'empty'
  }
};




export default function HomeScreen() {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#121212" : "#ffffff",
    flex: 1
  };

  NavigationBar.setBackgroundColorAsync(backgroundStyle.backgroundColor);
  NavigationBar.setBorderColorAsync(backgroundStyle.backgroundColor);

  const showToast = (t1: string = '', t2: string = '') => {
    Toast.show({
      type: "success",
      text1: t1,
      text2: t2
    });
  }

  const [isModalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');

  const [allTime, setAllTime] = useState('');
  const [limitTime, setLimitTime] = useState('');

  const [buttonDesc, setButtonDesc] = useState('')
  const [buttonType, setButtonType] = useState(0)

  async function updateData() {
    await axios.get("http://time.xianyi.it/getTime").then(async (res) => {
      let data = res.data.data
      console.log(data);
      
      storeData("all" , ((data.all) / 60).toFixed())
      storeData("limit" , (data.Limit / 60).toFixed())

      const all = await getData('all');
      setAllTime(all);

      const limit = await getData('limit');
      setLimitTime(limit);
    })
  }

  useEffect(() => {
    const fetchAllTime = async () => {
      const all = await getData('all');
      setAllTime(all);
    };

    const fetchLimitTime = async () => {
      const limit = await getData('limit');
      setLimitTime(limit);
    };

    fetchAllTime();
    fetchLimitTime();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = (type: number = 0) => {
    setNumber('')
    setPassword('')
    if (type === 1) {
      toggleModal();
      setButtonDesc('设置每日限制时间(从明日开始)')
      setButtonType(1)
    } else if (type === 2) {
      toggleModal();
      setButtonDesc('设置今日可用时间(仅限今日)，如需减少当日可用时间，可用输入负数，但需要除2，即减少30分钟则输入-15')
      setButtonType(2)
    } else if (type === 0) {
      setButtonDesc('')
    }
  };

  const checkInput = () => {
    if (number && password === 'fh') {
      console.log('Number:', number);
      console.log('Password:', password);

      if (buttonType === 1) {
        axios.get(`https://time.xianyi.it/getTime/setLimit?type=always&limit=${number}`).then((res) => {
          showToast('设置成功', res.data.msg)
          updateData()
          toggleModal();
        })
      } else if (buttonType === 2) {
        axios.get(`https://time.xianyi.it/getTime/setLimit?type=today&limit=${number}`).then((res) => {
          showToast('设置成功', res.data.msg)
          updateData()
          toggleModal();
        })
      } else {
        showToast('未知错误')
        toggleModal();
      }
    } else {
      showToast('密码错误')
      toggleModal();
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      paddingTop: 20,
    },
    sonContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      width: "100%",
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 32,
      elevation: 3,
      backgroundColor: "#37a2da",
      margin: 10
    },
    text: {
      fontSize: 24,
      color: isDarkMode ? "#ffffff" : "#121212",
    },
    text1: {
      fontSize: 20,
      color: isDarkMode ? "#ffffff" : "#121212",
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
    buttonContainer: {
      width: 200, // 拉满父容器的宽度
      paddingHorizontal: 0, // 移除水平内边距
      borderRadius: 50
    },
  });


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <View style={styles.sonContent}>
          <Text style={styles.text}>
            已使用 {allTime} 分钟
          </Text>
          <Text style={styles.text}>
            超时限制 {limitTime} 分钟
          </Text>
        </View>
        <View style={styles.sonContent}>


          <View style={styles.buttonContainer}>
            <Button
              title={`设置每日可用时间`}
              onPress={() => { handleConfirm(1) }}
            />
          </View>
          <Text></Text>
          <View style={styles.buttonContainer}>
            <Button
              title={`设置今日可用时间`}
              onPress={() => handleConfirm(2)}
            />
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Modal visible={isModalVisible}
          animationType="slide"
        >
          <View style={styles.modalContent}>
            <Text style={styles.text1}>{buttonDesc}</Text>
            <Text></Text>
            <Text>输入数字为 分钟，如 60 则为一小时</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={number}
              onChangeText={setNumber}
              placeholder="输入 分钟数"
            />

            <Text>输入密码</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="输入 密码"
            />

            <Button title="确认" onPress={() => { checkInput() }} />
            <Button title="取消" onPress={toggleModal} color="red" />
          </View>
        </Modal>
      </View>
      {/* <View style={styles.container}>
      <Text style={styles.text}>
        已使用 {allTime} 分钟
      </Text>
      <Text style={styles.text}>
        超时限制 {limitTime} 分钟
      </Text>
      <Button
      title='Show toast'
      onPress={showToast}
    />
    <View style={styles.container}>
      <Button title="Show Modal" onPress={toggleModal} />
      <Modal visible={isModalVisible}
      animationType="slide"
      >
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
      </View> */}
    </SafeAreaView>
  );
}
