import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Query, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navigator from './src/frontend/Navigator';
import { storage } from './src/frontend/utils/mmkvStorage';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const clientStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key) => {
    storage.delete(key);
  },
};

const queryClient = new QueryClient()
const clientPersister = createSyncStoragePersister({ storage: clientStorage });

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: clientPersister }}> */}
        <Navigator />
        {/* </PersistQueryClientProvider> */}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
