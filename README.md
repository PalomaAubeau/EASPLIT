# EASPLIT

## Description
Easplit est une application mobile développée en React Native et Expo, conçue pour faciliter le partage des dépenses d'un événement entre les participants. Initialement réalisé en équipe sur une période de 9 jours (les repots initiaux se trouvent ici: https://github.com/PalomaAubeau/initial-easplit-frontend et https://github.com/PalomaAubeau/initial-easplit-backend), ce projet a été repris pour diviser le code en plus petits composants (architecture de l'application) et le rendre ainsi plus lisible et maintenable (hors CreateScreen); mais aussi corriger certains bugs.  
Certaines évolutions pourraient être envisagées. Celles-ci sont notifiées plus bas.
  
Vous pouvez retrouver l'application déployée sur ExpoGo en scannant le QRcode suivant (sur Expo):  
![Capture d’écran 2024-06-19 à 11 38 24](https://github.com/PalomaAubeau/EASPLIT/assets/154338327/2d8eb6cb-a2a6-402d-952d-91de0f18aa67)


## Fonctionnalités
#### Gestion des événements : 
Créez et suivez vos événements.
#### Suivi des paiements : 
Suivez les paiements effectués par chaque participant, l’application se charge de la répartition.
#### Partage des dépenses : 
Ajoutez des dépenses pour chaque événement de manière totalement transparente pour l’ensemble des paticipants.
#### Sécurité : 
Authentification sécurisée avec token et hashage du mot de passe.

## Installation
#### Cloner ou copier le code: 
```https://github.com/PalomaAubeau/EASPLIT.git``` 
```
cd EASPLIT
```

#### Ouvrez deux terminaux distincts et placez-vous dedant:
```
cd backend
```
```
cd frontend
```
#### Backend
Installez les dépendances :
```
yarn install
```
Démarrez le serveur :
```
nodemon
```
#### Frontend
Installez les dépendances :
```
yarn install
```
Démarrez l'application :
```
expo start
```

## Utilisation
#### Créer un compte ou connectez-vous avec un compte existant.
#### Créer un événement : 
Ajoutez les détails de l'événement et invitez des participants. L’application se charge de calculer le montant de chaque participation en fonction du budget initial.
#### Suivi de votre compte: 
Visualisez votre solde et rechargez-le si besoin. Visualisez vos dernières transactions et les événements auxquels vous participez
#### Suivre les paiements : 
Suivez les paiements effectués par les autres invités.
#### Ajouter des dépenses : 
Ajoutez les dépenses de l'événement que vous avez créé.

## Technologies utilisées
React Native : Framework pour construire des applications mobiles.  
Expo : Outils et services pour le développement de React Native.  
Node.js & Express : Backend pour gérer l'API et la base de données.  
MongoDB : Base de données NoSQL pour stocker les données des utilisateurs, des événements et des transactions.  

## Auteur
Ce projet a été initialement développé en équipe puis repris et amélioré par Paloma Aubeau.

## Evolutions potentielles
Il s’agit d’un projet de fin d’étude qui n’a pas vocation à être commercialisé. Pour aller plus loin, il serait envisageable de:
Donner la possibilité à chaque personne de modifier son compte (mot de passe, photo de profil par exemple)
- Ajouter la visualisation des informations de l’événement (date, date limite de participation, informations données dans la description)
- Donner la possibilité d’ajouter des invités après la création de l’événement (et réajuster le budget initial en fonction pour garder le montant par part identique - surtout si les autres invités ont déjà payé leur part)
- Ajouter un branchement vers une API de paiement sécurisée (Stripe par exemple, qui propose un service de test gratuit)
- Rembourser les invités à la fin de l’événement en fonction du budget restant.
- Ajouter la possibilité de se connecter avec Google
- Imposer un format de mot de passe (incluant caractères spéciaux/chiffres…) pour obliger nos utilisateurs à mieux sécuriser leur compte (en dépit du hashage que nous fournissons)
- Modifier la génération de token avec JWT (Json Web Token) qui semble plus complexe mais surtout plus abouti.
- Proposer un thème sombre

  ## Screenshot
  ![Présentation sans titre](https://github.com/PalomaAubeau/EASPLIT/assets/154338327/2ae2d56a-4809-4711-a667-f278decf2e0e)
  ![Présentation sans titre (1)](https://github.com/PalomaAubeau/EASPLIT/assets/154338327/4c8db6b6-ad30-45ef-bcd3-6c76c481dead)


