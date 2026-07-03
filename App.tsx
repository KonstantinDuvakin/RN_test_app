/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { ThemeProvider } from './src/shared/theme/ThemeContext.tsx';
import { ModalProvider } from './src/shared/modal/ModalProvider.tsx';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { persister, queryClient } from './src/shared/query/queryClient.ts';

import './src/app/bootstrap.ts';

function App() {
  return (
    <ThemeProvider>
      <ModalProvider>
        <SafeAreaProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister,
              maxAge: 1000 * 60 * 60 * 24, // кэш с диска старше 24ч не восстанавливаем
              buster: 'v1', // меняешь схему данных → бампаешь строку → старый persist выбрасывается
            }}
            onSuccess={() => queryClient.resumePausedMutations()}
          >
            <RootNavigator />
          </PersistQueryClientProvider>
        </SafeAreaProvider>
      </ModalProvider>
    </ThemeProvider>
  );
}

export default App;
