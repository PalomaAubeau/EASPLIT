import { PATH } from "./path";

export const getUserEvents = async (token) => {
  const response = await fetch(`${PATH}/events/user/${token}`);
  const eventsList = await response.json();
  if (eventsList.result) {
    return eventsList.events;
  }
};

// export const getUserEvents = async (token) => {
//   try {
//     const response = await fetch(`${PATH}/events/user/${token}`);

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const eventsList = await response.json();

//     if (eventsList.result) {
//       return eventsList.events;
//     } else {
//       throw new Error("Failed to fetch events: result is false");
//     }
//   } catch (error) {
//     console.error("Error fetching user events:", error);
//     return []; // Retourne un tableau vide ou une valeur par défaut en cas d'erreur
//   }
// };
