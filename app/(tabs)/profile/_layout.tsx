import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="open-shop" 
        options={{ 
          animation: 'slide_from_right',
          presentation: 'card' 
        }} 
      />
    </Stack>
  );
}