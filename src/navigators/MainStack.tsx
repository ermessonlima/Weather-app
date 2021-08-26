import React from 'react';
import Home from '../screens/Home';
import City from '../screens/City';

import { createStackNavigator } from '@react-navigation/stack';

const MainsStack = createStackNavigator();

export default () =>  (
        <MainsStack.Navigator>
            <MainsStack.Screen name="Home" component={Home} />
            <MainsStack.Screen name="City" component={City} />
        </MainsStack.Navigator>
    )
