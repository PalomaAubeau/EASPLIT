import { StyleSheet } from "react-native";
import { View, Text, Platform } from "react-native";
import React from "react";

const RecapPayment = ({ user, event }) => {
  const userPayment = (event.totalSum / event.shareAmount) * user.share;
  return (
    <View
      style={[
        styles.RecapEventCard,
        Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
      ]}
    >
      <View style={{ ...styles.recapCardRow, margin: 3 }}>
        <Text style={styles.textCurrentListCard}>Budget initial</Text>
        <Text style={styles.textPaymentRecapLeft}>
          {event.totalSum.toFixed(2)}€
        </Text>
      </View>
      <View style={{ ...styles.recapCardRow, margin: 3 }}>
        <Text style={styles.textCurrentListCard}>Nombre de participants</Text>
        <Text style={styles.textPaymentRecapLeft}>{event.guests.length}</Text>
      </View>
      <View style={{ ...styles.recapCardRow, margin: 3 }}>
        <Text style={styles.textCurrentListCard}>Ma participation</Text>
        <Text style={styles.textPaymentRecapLeft}>
          {userPayment.toFixed(2)}€
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  recapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  RecapEventCard: {
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 150,
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  textCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
  },
  textPaymentRecapLeft: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#4E3CBB",
  },
});

export default RecapPayment;
