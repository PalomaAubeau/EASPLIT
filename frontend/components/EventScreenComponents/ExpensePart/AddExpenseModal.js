import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { PATH } from "../../../utils/path";
import globalStyles from "../../../styles/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const AddExpenseModal = ({ modalVisible, setModalVisible, setUrlImage }) => {
  const [loading, setLoading] = useState(false);
  const saveImage = async (imageUri) => {
    try {
      const fileName = imageUri.split("/").pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath,
      });
      // console.log("imageUri dans SaveImage:", imageUri);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== "granted") {
        console.error("Camera permission not granted");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 1,
      });
      if (result.canceled) {
        console.log("User canceled the photo");
        return;
      }
      if (!result.assets || !result.assets[0].uri) {
        console.error("No photo taken or URI is missing");
        return;
      }

      const imageUri = result.assets[0].uri;
      await saveImage(imageUri);
      const formData = new FormData();

      formData.append("photoFromFront", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      setLoading(true);
      const response = await fetch(`${PATH}/events/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      // console.log("data dans modal AddExpenseModal:", data);
      if (data.result) {
        setUrlImage(data.url);
      } else {
        console.error("Error uploading image:", data.error);
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

      if (result.canceled) {
        console.log("User canceled the photo uploading");
        return;
      }
      if (!result.assets || !result.assets[0].uri) {
        console.error("URI is missing");
        return;
      }
      const imageUri = result.assets[0].uri;
      await saveImage(imageUri);
      const formData = new FormData();

      formData.append("photoFromFront", {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      setLoading(true);
      const response = await fetch(`${PATH}/events/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      if (data.result) {
        setUrlImage(data.url);
        console.log("Image URL:", data.url);
      } else {
        console.error("Error uploading image:", data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
            style={globalStyles.buttonContainer}
            activeOpacity={0.8}
            onPress={() => takePhoto()}
            disabled={loading}
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={globalStyles.gradientBackground}
            >
              <View style={globalStyles.textContainer}>
                <Text style={styles.textStyleChoose}>Prendre une photo</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.buttonContainer}
            activeOpacity={0.8}
            onPress={() => choosePhotoFromLibrary()}
            disabled={loading}
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={globalStyles.gradientBackground}
            >
              <View style={globalStyles.textContainer}>
                <Text style={styles.textStyleChoose}>
                  Choisir une photo de la bibliothèque
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => setModalVisible(!modalVisible)}
            disabled={loading}
          >
            <Text style={styles.textStyleChoose}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  buttonClose: {
    backgroundColor: "#4E3CBB",
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
    width: 180,
    height: 45,
  },
  textStyleChoose: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
  },
});

export default AddExpenseModal;
