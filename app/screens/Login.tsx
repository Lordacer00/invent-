import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useRef, useEffect} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#323844',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0c0c040',
    width: '100%',
    padding: 16,
  },
  textInput: {
    borderBottomWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '80%',
    margin: 8,
  },
});

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};
type LoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function Login({navigation}: LoginProps): React.JSX.Element {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, slideAnim]);

  const btnIngresarOnPress = async function () {
    if (usuario && contrasena) {
      navigation.navigate('Home');
      return;
    }
    Alert.alert('Fallido', 'Datos incorrectos');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.container, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
        <Text style={{color: 'white', fontSize: 24, marginBottom: 16}}>Iniciar sesión</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Usuario"
          placeholderTextColor="#828894"
          onChangeText={u => setUsuario(u)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contraseña"
          placeholderTextColor="#828894"
          secureTextEntry={true}
          onChangeText={p => setContrasena(p)}
        />
        <Button title="Ingresar" onPress={btnIngresarOnPress} />
      </Animated.View>
    </SafeAreaView>
  );
}

export default Login;
