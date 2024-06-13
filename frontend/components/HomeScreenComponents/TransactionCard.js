import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const Transaction = ({ name, description, amount }) => {
  return (
    <View
      style={[
        styles.transactionContainer,
        Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
      ]}
    >
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.amount}>{amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    height: 60,
    paddingHorizontal: 15,
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
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E3CBB",
  },
  description: {
    fontSize: 14,
    color: "#888",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff69b4",
    textAlign: "right",
  },
});

export default Transaction;
