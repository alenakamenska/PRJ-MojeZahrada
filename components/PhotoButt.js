import { Pressable, StyleSheet, Text } from 'react-native';

function IconButt({ onPress, title }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
    <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export default IconButt;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#a5d6a7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  text:{
    fontSize: 20,
    color:'black)',
  }
});