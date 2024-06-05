import React, {useEffect, useState, useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View, Animated} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {Product} from '../model/Product';

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({route, navigation}: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product>(undefined!);

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

  return (
    <SafeAreaView style={style.page}>
      {product && (
        <Animated.View style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
          <Text style={style.header}>{product.nombre}</Text>
          <View style={style.row}>
            <Text style={[style.text, style.col]}>Existencias:</Text>
            <Text style={[style.text, style.colAuto]}>
              <Text
                style={
                  product.currentStock < product.minStock
                    ? style.stockError
                    : null
                }>
                {product.currentStock}
              </Text>{' '}
              / {product.maxStock}
            </Text>
          </View>
          <View style={style.row}>
            <Text style={[style.text, style.col]}>Precio:</Text>
            <Text style={[style.text, style.colAuto]}>
              $ {product.precio.toFixed(2)}
            </Text>
          </View>
        </Animated.View>
      )}
      <Animated.View style={[style.row, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
        <Button
          title="Entrada"
          onPress={() => navigation.push('EntradasScreen', {product})}
        />
        <Button
          title="Salida"
          onPress={() => navigation.push('SalidasScreen', {product})}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  page: {
    margin: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 36,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  col: {
    flex: 1,
    fontSize: 18,
  },
  colAuto: {
    fontSize: 18,
  },
  stockError: {
    color: 'red',
  },
  text: {
    fontSize: 18,
  },
});

export default ProductDetails;
