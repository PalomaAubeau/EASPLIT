// Importation des modules nécessaires
var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");
const Transaction = require("../models/transactions");

const { checkBody } = require("../modules/checkBody");

// Route pour obtenir les transactions de type expense d'un événement
router.get("/expenses/:eventId", async (req, res) => {
  try {
    // Recherche de l'événement
    const event = await Event.findById(req.params.eventId).populate(
      "transactions"
    );
    // Vérification de l'existence de l'événement
    if (!event) {
      return res.json({ response: false, error: "Événement non trouvé" });
    }
    // Filtrage des transactions de type expense
    const expenses = event.transactions.filter(
      (transaction) => transaction.type === "expense"
    );
    // Renvoi des transactions de type expense
    res.json({ response: true, expenses });
  } catch (error) {
    // Gestion des erreurs
    res.json({ response: false, error: error.message });
  }
});

// Route pour créer une dépense
router.post("/expense", (req, res) => {
  if (!checkBody(req.body, ["emitter", "amount", "type"])) {
    return res.status(400).json({ error: "Corps invalide" });
  }
  const transaction = new Transaction(req.body);
  transaction.save().then(() => {
    Event.findByIdAndUpdate(
      req.body.emitter,
      {
        $inc: { remainingBalance: -Number(req.body.amount) },
        $push: { transactions: transaction._id },
      },
      { new: true }
    ).then((event) => {
      if (!event) {
        return res.status(400).json({ error: "Événement non trouvé" });
      }

      if (event.totalSum < 0) {
        return res.status(400).json({ error: "Fonds insuffisants" });
      }
      res.json({ response: true, transaction });
    });
  });
});

// Route pour obtenir les transactions d'un utilisateur
router.get("/user-transactions/:token", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token }).populate(
      "transactions"
    );
    if (!user) {
      return res.json({ response: false, error: "Utilisateur non trouvé" });
    }
    // Inverser l'ordre des transactions
    const reversedTransactions = user.transactions.reverse();
    res.json({ response: true, transactions: reversedTransactions });
  } catch (error) {
    res.json({ response: false, error: error.message });
  }
});

//Route pour créer un paiement sur un évènement, ajouter la transaction dans la BDD (collections transactions et user), modifier statut du paiment de l'utilisateur sur EventScreen
router.post("/payment", async (req, res) => {
  const { token, eventId, type } = req.body;
  const userCall = User.findOne({ token });
  const eventCall = Event.findById(eventId) //dans EventCard => eventId: event._id
    .populate("guests.userId", [
      "userId",
      "firstName",
      "email",
      "share",
      "hasPaid",
    ])
    .populate("transactions");
  const [user, event] = await Promise.all([userCall, eventCall]); // Pour éviter de faire les recherches l'une derrière l'autre mais plutôt un seul call

  if (!user) {
    res.json({ result: false, error: "Compte utilisateur non trouvé" });
    return;
  }

  if (!event) {
    res.json({ result: false, error: "Evénement non trouvé" });
    return;
  }

  const shareAmountPerGuest = event.totalSum / event.shareAmount;

  const samePerson = event.guests.find(
    (guest) => String(guest.userId._id) === String(user._id)
  );
  if (samePerson) {
    const userDue = shareAmountPerGuest * samePerson.share;
    if (user.balance < Number(userDue)) {
      res.json({ result: false, error: "Veuillez recharger votre compte" });
      return;
    }
    const balanceSetForUser = user.balance - Number(userDue);
    const userPayment = new Transaction({
      amount: userDue,
      type,
      eventId: event._id,
      emitter: user._id,
      recipient: event._id,
      name: event.name,
    });
    // Sauvegarde de la transaction et mise à jour des documents des autres collections
    const transactionSaved = await userPayment.save();

    const updatedUserCall = User.updateOne(
      { _id: user._id },
      {
        $push: { transactions: userPayment._id },
        $set: { balance: balanceSetForUser },
      }
    );
    const updatedEventCall = Event.updateOne(
      {
        _id: event._id,
        "guests.userId": samePerson.userId._id,
      },
      { $set: { "guests.$.hasPaid": true } }
    );

    await Promise.all([updatedUserCall, updatedEventCall]);
    res.json({ result: true, transactionSaved });
  }
});

// Route pour recharger le solde et créer une transaction
router.put("/reload/:token", async (req, res) => {
  const amount = req.body.amount;

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Montant invalide" });
  }

  try {
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    const newBalance = Number(user.balance) + Number(amount);
    const transaction = new Transaction({
      emitter: user._id,
      recipient: user._id,
      type: "reload",
      amount,
    });

    await User.updateOne(
      { _id: user._id },
      {
        $set: { balance: newBalance },
        $push: { transactions: transaction._id },
      }
    );
    await transaction.save();
    res.json({ result: true, transaction });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
