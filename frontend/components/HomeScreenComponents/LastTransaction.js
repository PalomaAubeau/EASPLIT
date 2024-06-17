import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import Transaction from "./TransactionCard";
import { getUserTransactions } from "../../utils/getUserTransactions";
import { StyleSheet } from "react-native";

const LastTransactions = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [lastTransactions, setLastTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getUserTransactions(user.token);

        const transactionsList = transactions.slice(0, 2).map((transaction) => {
          let name = "";
          let description = "";
          let amount = "";

          if (transaction.type === "refund") {
            name = `Remboursement +${transaction.name}`;
            description = "Remboursement clôture événement";
            amount = `+ ${transaction.amount.toFixed(2)} €`;
          } else if (transaction.type === "reload") {
            name = "Rechargement";
            description = "Rechargement de mon compte";
            amount = `+ ${transaction.amount.toFixed(2)} €`;
          } else if (transaction.type === "payment") {
            name = `${transaction.name}`;
            description = "Participation";
            amount = `- ${transaction.amount.toFixed(2)} €`;
          }
          return {
            ...transaction, //je récupère tout l'objet transaction et j'ajoute les clés d'après
            name,
            description,
            amount,
          };
        });
        setLastTransactions(transactionsList);
        setLoading(false);
      } catch (error) {
        console.error("Échec de la récupération des transactions", error);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user.balance]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#4E3CBB" />
      ) : lastTransactions.length === 0 ? (
        <Text style={styles.message}>Aucune transaction pour le moment.</Text>
      ) : (
        lastTransactions.map((data) => (
          <Transaction
            key={data._id}
            name={data.name}
            description={data.description}
            amount={data.amount}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontFamily: "CodecPro-Regular",
    color: "#EB1194",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
});

export default LastTransactions;
