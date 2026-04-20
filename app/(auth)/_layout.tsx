import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen 
        name="sign-in" 
        options={{ animation: 'slide_from_left' }} 
      />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}