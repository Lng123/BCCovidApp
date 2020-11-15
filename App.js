import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainStats from './components/MainStats';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>BC COVID-19 app by Johnny Kim</Text>
      <MainStats/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
