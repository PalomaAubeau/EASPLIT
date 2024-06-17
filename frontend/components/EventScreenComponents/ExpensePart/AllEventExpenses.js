import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import SeeExpenseModal from "./SeeExpenseModal";

const AllEventExpenses = ({ expenses }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleOpenModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  return (
    <View>
      {expenses.length === 0 ? (
        <Text style={styles.message}>
          Aucune dépense à afficher pour le moment
        </Text>
      ) : (
        [...expenses].reverse().map((expense) => (
          <View
            key={expense._id}
            style={[
              styles.listCard,
              Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
            ]}
          >
            <Text style={styles.textCurrentListCard}>{expense.name}</Text>
            <View style={styles.leftPartInsideCard}>
              <Text style={{ ...styles.textCurrentListCard, marginRight: 30 }}>
                {expense.amount}€
              </Text>
              <TouchableOpacity
                onPress={() => handleOpenModal(expense.invoice)}
              >
                <Icon name="document-text-sharp" size={25} color="#4E3CBB" />
              </TouchableOpacity>
              <SeeExpenseModal
                expense={expense}
                imageUri={selectedImage}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 20,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    height: 60,
    marginHorizontal: 10,
  },
  shadowAndroid: {
    elevation: 6,
  },
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  leftPartInsideCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  textCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
  },
  message: {
    fontFamily: "CodecPro-Regular",
    color: "#EB1194",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default AllEventExpenses;
