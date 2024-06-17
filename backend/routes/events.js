var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

require("../models/connection");
const Event = require("../models/events");
const User = require("../models/users");
const Transaction = require("../models/transactions");

const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;
const uniqid = require("uniqid");
const fs = require("fs");

//const { addUserToGuest } = require("./users");

// Route utilisée dans le screen CreateEventScreen
router.post("/create/:token", async (req, res) => {
  try {
    // Récupération du token de l'utilisateur
    const token = req.params.token;
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, error: "Utilisateur non trouvé" });
    }

    // Vérification des champs obligatoires
    const requiredFields = [
      "name",
      "eventDate",
      "paymentDate",
      "description",
      "guests",
      "totalSum",
    ];
    if (!checkBody(req.body, requiredFields)) {
      return res.json({ result: false, error: "Champs manquants ou vides" });
    }

    // Vérification des dates
    if (
      isNaN(new Date(req.body.eventDate)) ||
      isNaN(new Date(req.body.paymentDate))
    ) {
      return res.json({ result: false, error: "Date invalide" });
    }

    let organizerShare = 1;
    let guests = [];

    // Construction de la liste des invités
    for (let participant of req.body.guests) {
      let participantShare = Number(participant.parts);
      if (isNaN(participantShare)) {
        return res.json({
          result: false,
          error: "Le partage doit être un nombre",
        });
      }

      // Vérification si l'utilisateur est l'organisateur
      if (participant.email === user.email) {
        organizerShare = participantShare;
        guests.push({
          userId: user._id,
          email: user.email,
          share: organizerShare,
          hasPaid: false,
        });
      } else {
        let participantUser = await User.findOne({ email: participant.email });

        if (!participantUser) {
          participantUser = new User({ email: participant.email });
          await participantUser.save();
        }

        guests.push({
          userId: participantUser._id,
          email: participantUser.email,
          share: participantShare,
          hasPaid: false,
        });
      }
    }

    // Calcul du montant total des parts
    let shareAmount = guests.reduce((total, guest) => total + guest.share, 0);

    // Création de l'événement
    const newEvent = new Event({
      eventUniqueId: uid2(32),
      organizer: user._id,
      name: req.body.name,
      eventDate: new Date(req.body.eventDate),
      paymentDate: new Date(req.body.paymentDate),
      description: req.body.description,
      guests: guests,
      totalSum: req.body.totalSum,
      shareAmount: shareAmount,
      transactions: [],
    });

    // Sauvegarde de l'événement
    const savedEvent = await newEvent.save();

    // Mise à jour des événements pour les invités
    for (let guest of guests) {
      if (guest.userId.toString() !== user._id.toString()) {
        await User.updateOne(
          { _id: guest.userId },
          { $push: { events: savedEvent._id } }
        );
      }
    }

    // Mise à jour de la liste des événements de l'organisateur
    await User.updateOne(
      { _id: newEvent.organizer },
      { $push: { events: savedEvent._id } }
    );

    res.json({
      result: true,
      message: "Evénement créé avec succès",
      data: savedEvent,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'événement :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur" });
  }
});

//Route utilisée dans le screen EventScreen (récupération des données d'un évènement ciblé)
router.get("/:id", (req, res) => {
  Event.findById(req.params.id)
    .populate("organizer", ["firstName", "email"])
    .populate("guests.userId", [
      "userId",
      "firstName",
      "email",
      "share",
      "hasPaid",
    ]) //Récupération des champs qui nous intéresse dans l'object
    .populate("transactions")
    .then((event) => {
      if (!event) {
        res.json({ result: false, error: "Évènement non trouvé" });
        return;
      }
      res.json({
        result: true,
        event, // on renvoie l'object event au complet dans le champs event soit => event: event
      });
    });
});

//Route utilisée dans le screen EventsListScreen (récupération de la liste des évènements grâce au token de l'user)
router.get("/user/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate("events")
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: "Compte utilisateur non trouvé" });
        return;
      }
      res.json({ result: true, events: user.events });
    });
});

//Route pour upload les fichiers
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.photoFromFront) {
      return res.status(400).json({ result: false, error: "No file uploaded" });
    }

    const photoPath = `/tmp/${uniqid()}.jpg`;
    await req.files.photoFromFront.mv(photoPath);

    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });

    fs.unlinkSync(photoPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: error.message });
  }
});

module.exports = router;
