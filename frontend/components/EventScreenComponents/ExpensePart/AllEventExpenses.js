import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
} from "react-native";
import { useState } from "react";

const AllEventExpenses = ({ expenses }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);

  const handleIconClick = (expense) => {
    setSelectedExpense(expense);
    setModalPhotoVisible(true);
  };
  return (
    <View style={{ height: 200, marginTop: 10, marginBottom: 30 }}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {[...expenses].reverse().map((expense, index) => (
          <View
            key={index}
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
              <TouchableOpacity onPress={() => handleIconClick(expense)}>
                <Icon name="document-text-sharp" size={25} color="#4E3CBB" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalPhotoVisible}
          onRequestClose={() => setModalPhotoVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedExpense && (
                <Image
                  source={{ uri: selectedExpense.invoice }}
                  style={styles.image}
                />
              )}
              <TouchableOpacity onPress={() => setModalPhotoVisible(false)}>
                <Text style={styles.closeImage}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  //MAINS CONTAINERS
  scrollView: {
    marginBottom: 20,
  },
  participer: {
    height: 25,
  },
  button: {
    paddingHorizontal: 10,
    width: "50%",
  },
  selectedButton: {
    backgroundColor: "#4E3CBB",
    borderRadius: 5,
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
  recapCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 50,
    height: 200,
    marginHorizontal: 10,
    marginTop: 15,
  },
  recapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amount: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  RecapEventCard: {
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    height: 150,
  },
  textGoBack: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
    marginLeft: 20,
  },
  textButton: {
    color: "#FFFFFF",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    textAlign: "center",
  },
  textCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
  },
  textAddingCard: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#EB1194",
    fontSize: 16,
  },
  message: {
    fontFamily: "CodecPro-Regular",
    color: "#EB1194",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  textRecap: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
    marginTop: 10,
  },
  textRecapAmount: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
  },
  textRecapBalance: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#EB1194",
    fontSize: 25,
  },
  currentUserText: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
  },
  textPaymentRecapLeft: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#4E3CBB",
  },
  textSmallCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 12,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    fontFamily: "CodecPro-ExtraBold",
    width: 180,
    borderBottomColor: "#4E3CBB",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    marginBottom: 40,
    marginTop: 30,
    fontSize: 20,
    color: "#4E3CBB",
    textAlign: "center",
  },

  buttonClose: {
    backgroundColor: "#EB1194",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  buttonChosePicture: {
    backgroundColor: "#4E3CBB",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    fontSize: 22,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleChoose: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 15, //ou 14 ?
  },
  imageContainer: {
    position: "absolute",
    marginTop: 20,
  },
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
  closeImage: {
    color: "#4E3CBB",
    fontFamily: "CodecPro-ExtraBold",
  },
  image: {
    width: 250,
    height: 450,
    marginBottom: 20,
  },
});

export default AllEventExpenses;
