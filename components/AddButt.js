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
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d4a373',
    padding: 15,
  },
  pressed: {
    opacity: 0.7,
  },
  text:{
    fontSize: 20,
    color:'black)',
  }
});