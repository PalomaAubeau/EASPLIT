import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import globalStyles from "../../styles/globalStyles";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { PATH } from "../../utils/path";

const ReloadModal = ({ user, addBalance, modalVisible, setModalVisible }) => {
  const [rechargeAmount, setRechargeAmount] = useState("");

  const handleModalClose = () => {
    setModalVisible(false);
    setRechargeAmount("");
  };

  const handleRecharge = async () => {
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      console.error("Invalid recharge amount");
      return;
    }
    const amount = Number(rechargeAmount);

    try {
      const response = await fetch(
        `${PATH}/transactions/reload/${user.token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "reload",
            amount,
          }),
        }
      );

      const data = await response.json();

      if (data.result) {
        addBalance(amount);
        setRechargeAmount("");
        setModalVisible(false);
      } else {
        console.error("Error: transaction failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
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
      <BlurView intensity={60} style={styles.absolute}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Montant du rechargement</Text>
            <TextInput
              placeholder="Montant €"
              keyboardType="numeric"
              textContentType="number"
              onChangeText={(value) => setRechargeAmount(value)}
              value={rechargeAmount}
              style={styles.input}
              placeholderTextColor="#b5b5b5"
            />
            <TouchableOpacity
              style={globalStyles.buttonContainer}
              activeOpacity={0.8}
              onPress={handleRecharge}
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
            <TouchableOpacity activeOpacity={0.8} onPress={handleModalClose}>
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
  modalText: {
    marginBottom: 0,
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 20,
    textAlign: "center",
  },
  closeButtonText: {
    fontFamily: "CodecPro-Regular",
    fontSize: 16,
    marginTop: 5,
    height: 32,
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
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonContainer: {
    display: "flex",
    width: 180,
    marginTop: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  reloadbuttonText: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default ReloadModal;
