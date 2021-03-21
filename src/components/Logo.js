import React from 'react';
import {Image, StyleSheet} from 'react-native';

export default function Logo() {
  return (
    <Image source={require('../assets/test_logo_4.png')} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 192,
    height: 192,
    marginBottom: 20,
    marginLeft: 0,
  },
});
