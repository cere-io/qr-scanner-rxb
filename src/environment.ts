if (!process.env.REACT_APP_APP_ID) {
  throw new Error('please set REACT_APP_APP_ID env parameter');
}
const APP_ID = process.env.REACT_APP_APP_ID;

if (!process.env.REACT_APP_API_IDENTITY_URL) {
  throw new Error('please set REACT_APP_API_IDENTITY_URL env parameter');
}
const API_IDENTITY_URL = process.env.REACT_APP_API_IDENTITY_URL;

export {APP_ID, API_IDENTITY_URL};
