const userId = 'userId';
const locationId = 'locationId';
const eventId = 'eventId';

function getLS(key) {
  return window.localStorage.getItem(key);
}

function setLS(key, value) {
  window.localStorage.setItem(key, value);
}

export function getUserId() {
  return getLS(userId);
}

export function setUserId(value) {
  setLS(userId, value);
}

export function getLocationId() {
  return getLS(locationId);
}

export function setLocationId(value) {
  setLS(locationId, value);
}

export function getEventId() {
  return getLS(eventId);
}

export function setEventId(value) {
  setLS(eventId, value);
}

export function clearStorage() {
  window.localStorage.removeItem(eventId);
  window.localStorage.removeItem(locationId);
  window.localStorage.removeItem(userId);
}
