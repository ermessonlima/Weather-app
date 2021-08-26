import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigators/MainStack';
import { Provider } from 'react-redux';
import {store, persistor} from './src/store';
import { PersistGate } from 'redux-persist/lib/integration/react';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate  loading={null} persistor={persistor}> 
      <NavigationContainer  >
        <MainStack />
      </NavigationContainer>
      </PersistGate>
    
    </Provider>

  )
}