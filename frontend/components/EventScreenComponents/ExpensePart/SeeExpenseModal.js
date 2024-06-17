import { StyleSheet } from "react-native";

import { View, Text, TouchableOpacity, Image, Modal } from "react-native";

const SeeExpenseModal = ({ imageUri, modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onError={(error) => console.error("Error loading image:", error)}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeImage}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 450,
    marginBottom: 20,
  },
});
export default SeeExpenseModal;
