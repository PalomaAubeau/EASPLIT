import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { PATH } from "../../../utils/path";

import * as ImagePicker from "expo-image-picker";
import AllEventExpenses from "../ExpensePart/AllEventExpenses";
import RecapExpense from "../ExpensePart/RecapExpense";

const Expense = ({ user, event }) => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const isOrganizer = event.organizer && event.organizer.email === user.email;

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `${PATH}/transactions/expenses/${event._id}`
      );
      const data = await response.json();
      if (data.response) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Besoin d'attendre que le fetch de l'event (async/await) soit charchgé pour pouvoir faire le fetch des dépenses, sinon l'event est undefined
  useEffect(() => {
    if (event) {
      fetchExpenses();
    }
  }, [event]);

  const saveImage = async (image) => {
    try {
      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const takePhoto = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 1,
      });
      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
        const formData = new FormData();

        formData.append("photoFromFront", {
          uri: result.assets[0].uri,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const response = await fetch(`${PATH}/events/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.result) {
          setUrlImage(data.url);
          console.log("Image URL:", data.url);
        } else {
          console.error("Error uploading image:", data.error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const choosePhotoFromLibrary = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 1,
      });
      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
        const formData = new FormData();

        formData.append("photoFromFront", {
          uri: result.assets[0].uri,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const response = await fetch(`${PATH}/events/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.result) {
          setUrlImage(data.url);
          console.log("Image URL:", data.url);
        } else {
          console.error("Error uploading image:", data.error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitExpense = async () => {
    try {
      const requestBody = {
        emitter: event._id,
        amount: Number(expenseAmount),
        type: "expense",
        name: expenseName,
        invoice: urlImage,
      };

      const response = await fetch(`${PATH}/transactions/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (data.response) {
        fetchExpenses();
        setExpenseName("");
        setExpenseAmount("");
        setUrlImage("");
      } else {
        console.error("Error in response:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <AllEventExpenses expenses={expenses} />
        {isOrganizer && (
          <View
            style={[
              { ...styles.listCard, marginVertical: 10 },
              Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
            ]}
          >
            <TextInput
              style={styles.textAddingCard}
              placeholder="Nom  "
              value={expenseName}
              onChangeText={(value) => setExpenseName(value)}
            />
            <View style={styles.leftPartInsideCard}>
              <TextInput
                style={{ ...styles.textAddingCard, marginRight: 30 }}
                placeholder="XX€ "
                keyboardType="numeric"
                value={expenseAmount}
                onChangeText={(text) => {
                  if (text.includes(".") && text.split(".")[1].length > 2) {
                    const truncatedText = text.substring(
                      0,
                      text.indexOf(".") + 3
                    );
                    setExpenseAmount(truncatedText);
                  } else if (!isNaN(text)) {
                    setExpenseAmount(text);
                  }
                }}
              />
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon name="document-text-sharp" size={25} color="#EB1194" />
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonChosePicture]}
                      onPress={() => takePhoto()}
                    >
                      <Text style={styles.textStyleChoose}>
                        Prendre une photo
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.buttonChosePicture]}
                      onPress={() => choosePhotoFromLibrary()}
                    >
                      <Text style={styles.textStyleChoose}>
                        Choisir une photo de la bibliothèque
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Fermer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <TouchableOpacity onPress={submitExpense}>
                <Icon name="add-circle" size={30} color="#EB1194"></Icon>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <RecapExpense event={event} expenses={expenses} />
      </View>
    </KeyboardAvoidingView>
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

export default Expense;
