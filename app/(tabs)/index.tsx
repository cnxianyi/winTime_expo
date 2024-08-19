import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import * as NavigationBar from 'expo-navigation-bar';

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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import EchartPage from "@/pages/echart"
import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen() {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#121212" : "#ffffff",
    flex: 1
  }

  // 重新加载
  const [refreshKey, setRefreshKey] = useState(0);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {

      // 修改key 重新加载
      setRefreshKey(prevKey => prevKey + 1);
    }
  }, [isFocused]);

  NavigationBar.setBackgroundColorAsync(backgroundStyle.backgroundColor);
  NavigationBar.setBorderColorAsync(backgroundStyle.backgroundColor);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      paddingTop: 30
    },
    text: {
      fontSize: 24,
      color: isDarkMode ? "#ffffff" : "#121212",
    },
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <EchartPage key={refreshKey}></EchartPage>
      </View>
    </SafeAreaView>
  );
}


