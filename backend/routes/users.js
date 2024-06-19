var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");

const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const nodemailer = require("nodemailer");

// NON UTILISEE - Fonction pour ajouter un utilisateur à la liste des invités d'un événement
function addUserToGuest(user, eventId, res) {
  const mailString = process.env.MAIL_STRING;
  // On cherche l'événement avec l'ID donné
  Event.findById(eventId).then((event) => {
    if (event) {
      // On vérifie si l'utilisateur n'est pas déjà invité à l'événement
      const guestExist = event.guests.some(
        (guest) => guest.email.toLowerCase() === user.email.toLowerCase()
      );
      // Si l'utilisateur n'est pas déjà invité, on l'ajoute à la liste des invités
      if (!guestExist) {
        event.guests.push({
          userId: user._id,
          email: user.email,
          share: 1,
          hasPaid: false,
        });
        // On sauvegarde l'événement
        event.save().then(() => {
          // On envoie un email à l'utilisateur pour l'informer de son invitation
          let transporter = nodemailer.createTransport({
            service: "outlook",
            auth: {
              user: "easplit@outlook.com",
              pass: `${mailString}`,
            },
          });

          // On crée le contenu de l'email
          let description = event.description;
          let name = event.name;
          let organizerFirstName = event.organizer.firstName;
          let eventDate = event.date;
          let expoLink = "https://expo.io/@yourusername/your-app";

          let mailOptions = {
            from: "easplit@outlook.com",
            to: user.email,
            subject: "Invitation à un événement",
            text: `Bonjour, vous avez été invité par ${organizerFirstName} pour l'événement suivant : 
    ${name}
    Description de l'événement : ${description}
    Date de l'événement : ${eventDate}
    Rejoignez l'événement sur Easplit via : ${expoLink}`,
          };
          // On envoie l'email
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          // On renvoie une réponse positive si l'utilisateur a été ajouté et l'email envoyé
          res.json({
            result: true,
            message: "Invitation envoyée",
          });
        });
      } else {
        // Si l'utilisateur est déjà invité
        res.json({ result: true, message: "Compte déjà existant" });
      }
    } else {
      // Si l'événement n'est pas trouvé
      res.json({ result: false, error: "Événement non trouvé" });
    }
  });
}

// Route qui va créer un nouvel utilisateur
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "password", "email"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }
  const email = req.body.email.toLowerCase();

  // On cherche un utilisateur avec le même email (déjà invité)
  User.findOne({ email: email })
    .then((data) => {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const updatedUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        password: hash,
        token: uid2(32),
        balance: 0,
        events: data && data.events ? data.events : [],
        transactions: data && data.transactions ? data.transactions : [],
      };

      if (data) {
        // Si l'utilisateur est trouvé, mettre à jour ses informations
        User.updateOne({ _id: data._id }, updatedUser)
          .then(() => {
            res.json({
              result: true,
              data: {
                firstName: updatedUser.firstName,
                email: updatedUser.email,
                token: updatedUser.token,
                balance: updatedUser.balance,
                events: updatedUser.events,
                // userId: data._id,
              },
            });
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            res.status(500).json({
              result: false,
              error: "Erreur lors de la mise à jour du compte",
            });
          });
      } else {
        // Si aucun utilisateur n'est trouvé, créer un nouvel utilisateur
        const newUser = new User(updatedUser);
        newUser
          .save()
          .then((newDoc) => {
            res.json({
              result: true,
              data: {
                firstName: newDoc.firstName,
                email: newDoc.email,
                token: newDoc.token,
                balance: newDoc.balance,
                events: newDoc.events,
                //userId: newDoc._id,
              },
            });
          })
          .catch((error) => {
            console.error("Error saving user:", error);
            res.status(500).json({
              result: false,
              error: "Erreur lors de la création du compte",
            });
          });
      }
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res.status(500).json({
        result: false,
        error: "Erreur lors de la vérification du compte",
      });
    });
});
// route pour le login
router.post("/signin", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      return res.json({ result: false, error: "Champs manquants ou vides" });
    }
    const user = await User.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });

    if (!user) {
      return res.json({
        result: false,
        error: "Email ou mot de passe non trouvé",
      });
    }

    // Vérification du mot de passe à part
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.json({
        result: false,
        error: "Email ou mot de passe non trouvé",
      });
    }

    // Génération d'un nouveau token et sauvegarde dans la base de données
    user.token = uid2(32);
    await user.save();

    res.json({
      result: true,
      token: user.token,
      email: user.email,
      firstName: user.firstName,
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur" });
  }
});

// Route qui va déconnecter un utilisateur
router.post("/logout", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      data.token = "";
      data.save().then(() => {
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

router.get("/getbalance/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ token: token });

    if (user) {
      res.json({ balance: user.balance });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
