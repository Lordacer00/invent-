import React, {useEffect, useState, useRef} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import {Product} from '../model/Product';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export type MovimientosScreenParams = {
  product: Product;
};

export function EntradasScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EntradasScreen'>>();
  const [product, setProduct] = useState<Product>(undefined!);
  const [cantidad, setCantidad] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setProduct(route.params.product);
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
  }, [route]);

  const btnOnPress = function () {
    agregarMovimiento(product, new Date(), cantidad);
    updateStock(product, cantidad);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.container, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
        <Text style={styles.title}>{product?.nombre}</Text>
        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={t => setCantidad(Number.parseInt(t, 10))}
          keyboardType="numeric"
        />
        <Button title="Registrar entrada" onPress={btnOnPress} />
      </Animated.View>
    </SafeAreaView>
  );
}

export function SalidasScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'EntradasScreen'>>();
  const [product, setProduct] = useState<Product>(undefined!);
  const [cantidad, setCantidad] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setProduct(route.params.product);
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
  }, [route]);

  const btnOnPress = function () {
    if (cantidad > product.currentStock) {
      Alert.alert(
        'Cantidad excesiva',
        'La cantidad de salida excede el stock actual',
      );
      return;
    }
    agregarMovimiento(product, new Date(), cantidad * -1);
    updateStock(product, cantidad * -1);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.container, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
        <Text style={styles.title}>{product?.nombre}</Text>
        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={t => setCantidad(Number.parseInt(t, 10))}
          keyboardType="numeric"
        />
        <Button title="Registrar salida" onPress={btnOnPress} />
      </Animated.View>
    </SafeAreaView>
  );
}

async function agregarMovimiento(
  product: Product,
  fechaHora: Date,
  cantidad: number,
) {
  const db = await LocalDB.connect();
  await db.transaction(async tx => {
    await tx.executeSql(
      'INSERT INTO movimientos (id_producto, fecha_hora, cantidad) VALUES (?, ?, ?)',
      [product.id, fechaHora.toISOString(), cantidad],
      () => {},
      error => console.error(error),
    );
  });
}

async function updateStock(product: Product, cantidad: number) {
  const db = await LocalDB.connect();
  db.transaction(async tx => {
    tx.executeSql(
      'UPDATE productos SET currentStock = (currentStock + ?) WHERE id = ?',
      [cantidad, product.id],
      () => {},
      error => console.error(error),
    );
  });
}
