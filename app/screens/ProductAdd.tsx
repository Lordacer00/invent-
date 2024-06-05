import React, {useState, useRef, useEffect} from 'react';
import {Button, SafeAreaView, Text, TextInput, StyleSheet, Animated} from 'react-native';
import LocalDB from '../persistance/localdb';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import WebServiceParams from '../WebServiceParams';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default function ProductAdd(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState<string>('');
  const [precio, setPrecio] = useState<string>('0');
  const [minStock, setMinStock] = useState<string>('0');

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

  const btnGuardarOnPress = async () => {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO productos (nombre, precio, minStock) VALUES (?, ?, ?)',
        [nombre, precio, minStock],
      );
      navigation.goBack();
    });
    await fetch(
      `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nombre, precio, minStock}),
      },
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.container, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.textInput} onChangeText={t => setNombre(t)} />
        <Text style={styles.label}>Precio</Text>
        <TextInput style={styles.textInput} onChangeText={t => setPrecio(t)} keyboardType="numeric" />
        <Text style={styles.label}>Min. Stock</Text>
        <TextInput style={styles.textInput} onChangeText={t => setMinStock(t)} keyboardType="numeric" />
        <Button title="Guardar" onPress={btnGuardarOnPress} />
      </Animated.View>
    </SafeAreaView>
  );
}
