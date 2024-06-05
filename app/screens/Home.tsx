import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Animated} from 'react-native';
import {Product} from '../model/Product';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';
import WebServiceParams from '../WebServiceParams';

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
  navigation: HomeScreenProps;
  route: HomeScreenRoute;
};

function Home({navigation}: HomeProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const productItem = ({item, index}: {item: Product, index: number}) => {
    const itemTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.timing(itemTranslateY, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [itemTranslateY]);

    return (
      <Animated.View style={{transform: [{translateY: itemTranslateY}]}}>
        <TouchableOpacity
          style={styles.productItem}
          onPress={() => navigation.push('ProductDetails', {product: item})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text style={styles.itemTitle}>{item.nombre}</Text>
              <Text style={styles.itemDetails}>
                Precio: ${item.precio.toFixed(2)}
              </Text>
            </View>
            <Text
              style={[
                styles.itemBadge,
                item.currentStock < item.minStock ? styles.itemBadgeError : null,
              ]}>
              {item.currentStock}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  useEffect(() => {
    LocalDB.init();
    navigation.addListener('focus', async () => {
      try {
        const response = await fetch(
          `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'text/plain',
            },
          },
        );
        setProducts(await response.json());
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error(error);
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <Animated.FlatList
        data={products}
        renderItem={productItem}
        keyExtractor={item => item.id.toString()}
        style={{opacity: fadeAnim}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  itemTitle: {
    fontSize: 20,
    color: '#333',
  },
  itemDetails: {
    fontSize: 16,
    color: '#666',
  },
  itemBadge: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  itemBadgeError: {
    color: 'red',
  },
});

export default Home;
