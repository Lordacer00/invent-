import React from 'react';
import {Button} from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './app/screens/Home';
import Login from './app/screens/Login';
import ProductAdd from './app/screens/ProductAdd';
import ProductDetails, {
  Params as ProductDetailsParams,
} from './app/screens/ProductDetails';
import {
  EntradasScreen,
  MovimientosScreenParams,
  SalidasScreen,
} from './app/screens/MovimientosScreens';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ProductDetails: ProductDetailsParams;
  ProductAdd: undefined;
  EntradasScreen: MovimientosScreenParams;
  SalidasScreen: MovimientosScreenParams;
};
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

function HomeHeader(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Button title="Agregar" onPress={() => navigation.navigate('ProductAdd')} />
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#ff0040'},
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerRight: HomeHeader,
          }}
        />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="ProductAdd" component={ProductAdd} />
        <Stack.Screen name="EntradasScreen" component={EntradasScreen} />
        <Stack.Screen name="SalidasScreen" component={SalidasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
