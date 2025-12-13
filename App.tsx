import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import Toast from 'react-native-toast-message';

import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/RefNavigation';
import ErrorBoundary from './src/components/Common/ErrorBoundary';
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

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NetworkProvider>
          <ErrorBoundary>
            <NavigationContainer ref={navigationRef} linking={linking}>
              <OfflineBanner />
              <RootNavigator />
              <Toast />
            </NavigationContainer>
          </ErrorBoundary>
        </NetworkProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
