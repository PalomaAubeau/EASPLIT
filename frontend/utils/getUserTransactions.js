import { PATH } from "./path";

export const getUserTransactions = async (token) => {
  try {
    const response = await fetch(
      `${PATH}/transactions/user-transactions/${token}`
    );
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const userTransactions = await response.json();
    if (userTransactions.response) {
      return userTransactions.transactions;
    }
  } catch (error) {
    console.error("Échec de la récupération des transactions", error);
  }
};
