import { PATH } from "./path";

export const getEventData = async (eventId) => {
  const response = await fetch(`${PATH}/events/${eventId}`);
  const eventData = await response.json();
  if (eventData.result) {
    return eventData.event;
  }
};
