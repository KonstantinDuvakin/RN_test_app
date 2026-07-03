import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { TasksScreen } from '../../features/tasks/screens/TasksScreen';
import { authMMKV } from '../../shared/storage/authStorage';
import { TaskDetailScreen } from '../../features/tasks/screens/TaskDetailScreen.tsx';
import { FeedScreen } from '../../features/feed/screens/FeedScreen.tsx';
import { useMMKVString } from 'react-native-mmkv';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const [accessToken] = useMMKVString('accessToken', authMMKV);
  const isLoggedIn = !!accessToken;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={{ title: 'Задача' }}
            />
            <Stack.Screen
              name="Feed"
              component={FeedScreen}
              options={{ title: 'Лента' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
