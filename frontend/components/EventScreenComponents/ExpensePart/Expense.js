import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { PATH } from "../../../utils/path";

import AllEventExpenses from "../ExpensePart/AllEventExpenses";
import RecapExpense from "../ExpensePart/RecapExpense";
import AddExpenseModal from "./AddExpenseModal";

const Expense = ({ user, event }) => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const isOrganizer = event.organizer && event.organizer.email === user.email;
  const [errorMessage, setErrorMessage] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState(event.totalSum);
  const [totalExpenses, setTotalExpenses] = useState(0);

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

  // Attention: Besoin d'attendre que le fetch de l'event (async/await) soit charchgé pour pouvoir faire le fetch des dépenses, sinon l'event est undefined
  useEffect(() => {
    if (event) {
      fetchExpenses();
    }
  }, [event]);

  // S'arrurer que la balance est bien remise à jour chaque fois que les dépenses sont mises à jour
  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
    setRemainingBalance(event.totalSum - total);
  }, [expenses, event.totalSum]);

  const submitExpense = async () => {
    try {
      // Pour éviter un fetch inutile, vérifier les champs avant l'envoie
      if (!expenseName) {
        setErrorMessage("Veuillez donner un nom à votre dépense");
        return;
      }
      if (!expenseAmount) {
        setErrorMessage("Veuillez ajouter le montant de votre dépense");
        return;
      }

      if (!urlImage) {
        setErrorMessage("Veuillez ajouter une photo");
        return;
      }

      if (Number(expenseAmount) > remainingBalance) {
        setErrorMessage("Fonds insuffisants pour cette dépense");
        return;
      }

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
        setErrorMessage("");
      } else {
        console.error("Error in response:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View>
      <View style={{ height: 170, marginTop: 10, marginBottom: 30 }}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <AllEventExpenses expenses={expenses} />
        </ScrollView>
      </View>

      {isOrganizer && (
        <View
          style={[
            { ...styles.addCard },
            Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
          ]}
        >
          <View style={styles.addInRow}>
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
                  // Vérifie si le texte contient un point décimal
                  if (text.includes(".") && text.split(".")[1].length > 2) {
                    // Si le texte contient un point décimal et que la partie décimale a plus de 2 chiffres,
                    // on tronque le texte pour garder seulement deux chiffres après le point décimal.
                    const truncatedText = text.substring(
                      0,
                      text.indexOf(".") + 3
                    );
                    // Met à jour l'état avec le texte tronqué
                    setExpenseAmount(truncatedText);
                  } else if (!isNaN(text)) {
                    // Si le texte est un nombre valide (isNaN renvoie false pour les nombres valides),
                    // on met à jour l'état avec le texte saisi.
                    setExpenseAmount(text);
                  }
                }}
              />
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon name="document-text-sharp" size={25} color="#EB1194" />
              </TouchableOpacity>
              <AddExpenseModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setUrlImage={setUrlImage}
              />
            </View>
          </View>
          <View style={{ alignItems: "center", marginTop: 5 }}>
            <TouchableOpacity onPress={submitExpense}>
              <Icon name="add-circle" size={45} color="#EB1194"></Icon>
            </TouchableOpacity>
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
          </View>
        </View>
      )}
      <RecapExpense
        totalSum={event.totalSum}
        remainingBalance={remainingBalance}
        totalExpenses={totalExpenses}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 5,
    height: 120,
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
  addInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftPartInsideCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  textAddingCard: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#EB1194",
    fontSize: 16,
  },
  error: {
    color: "red",
  },
});

export default Expense;
