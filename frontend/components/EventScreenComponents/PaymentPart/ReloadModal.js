import { View, Text, TouchableOpacity, Modal } from "react-native";
import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const ReloadModal = ({
  navigation,
  modalVisible,
  setModalVisible,
  errorMessage,
  setErrorMessage,
}) => {
  const handleCloseModal = () => {
    setModalVisible(false);
    setErrorMessage(null);
  };
  return (
    <Modal
      modalVisible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <BlurView intensity={60} style={styles.absolute}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.error}>{errorMessage}</Text>
            <TouchableOpacity
              style={globalStyles.buttonContainer}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Accueil")}
            >
              <LinearGradient
                colors={["#EB1194", "#4E3CBB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={globalStyles.gradientBackground}
              >
                <View style={globalStyles.textContainer}>
                  <Text style={styles.reloadbuttonText}>Je recharge</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              activeOpacity={0.8}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
const styles = StyleSheet.create({
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
  error: {
    marginBottom: 10,
    color: "red",
  },
  reloadbuttonText: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#fff",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ReloadModal;
