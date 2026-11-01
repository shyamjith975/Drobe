import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F7F5F0' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="booking/[id]" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Book Consultation',
            headerStyle: { backgroundColor: '#F7F5F0' },
            headerTintColor: '#191919'
          }} 
        />
      </Stack>
    </>
  );
}
