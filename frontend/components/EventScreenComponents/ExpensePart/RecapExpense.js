import { StyleSheet } from "react-native";
import { View, Text, Platform } from "react-native";

const RecapExpense = ({ totalSum, remainingBalance, totalExpenses }) => {
  return (
    <View
      style={[
        styles.recapCard,
        Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
      ]}
    >
      <View style={styles.recapCardRow}>
        <View style={styles.amount}>
          <Text style={styles.textRecapAmount}>{totalSum}€</Text>
          <Text style={styles.textRecap}>Budget initial</Text>
        </View>
        <View style={styles.amount}>
          <Text style={styles.textRecapAmount}>{totalExpenses}€</Text>
          <Text style={styles.textRecap}>Total des dépenses</Text>
        </View>
      </View>
      <View style={[styles.amount, { marginTop: -10 }]}>
        <Text style={styles.textRecapBalance}>{remainingBalance}€</Text>
        <Text style={styles.textRecap}>Solde restant</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 30,
    height: 200,
    marginHorizontal: 10,
    marginTop: 20,
  },
  recapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  amount: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  textRecap: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
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
});

export default RecapExpense;
