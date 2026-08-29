import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NarrativePlayer } from './src/ui/NarrativePlayer';

export default function App() {
  return (
    <SafeAreaProvider>
      <NarrativePlayer />
    </SafeAreaProvider>
  );
}
