import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import Toast from 'react-native-toast-message';

import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/RefNavigation';
import { GlobalErrorBoundary } from '@zomato/ui';
import { NetworkProvider } from './src/context/NetworkContext';
import OfflineBanner from './src/components/Common/OfflineBanner';

const linking = {
  prefixes: ['zomato://', 'https://zomato-clone.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Search: 'search',
          Orders: 'orders',
          Profile: 'profile',
        },
      },
      RestaurantDetail: 'restaurant/:id',
    },
  },
};

import { useNotifications } from './src/hooks/useNotifications';

function App(): React.JSX.Element {
  useNotifications();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NetworkProvider>
          <GlobalErrorBoundary name="CustomerApp">
            <NavigationContainer ref={navigationRef} linking={linking}>
              <OfflineBanner />
              <RootNavigator />
              <Toast />
            </NavigationContainer>
          </GlobalErrorBoundary>
        </NetworkProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
