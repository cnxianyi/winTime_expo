import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'; // 导入 Toast 组件
const toastConfig = {
  //@ts-ignore
  success: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: '#37a2da' , height: 100 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 24, // 设置 text1 的字体大小
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 20, // 设置 text2 的字体大小
        color: 'gray'
      }}
      text1={text1}
      text2={text2}
    />
  ),
  //@ts-ignore
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 20 // 设置 ErrorToast 的字体大小
      }}
      text2Style={{
        fontSize: 16
      }}
    />
  ),
};


import { useColorScheme } from '@/hooks/useColorScheme';
import { View , Text } from 'react-native';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* @ts-ignore */}
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
