if (!process.env.REACT_APP_APP_ID) {
  throw new Error('please set REACT_APP_APP_ID env parameter');
}
const APP_ID = process.env.REACT_APP_APP_ID;

if (!process.env.REACT_APP_APP_TENANT_ID) {
  throw new Error('please set REACT_APP_APP_TENANT_ID env parameter');
}
const APP_TENANT_ID = process.env.REACT_APP_APP_TENANT_ID;

if (!process.env.REACT_APP_API_IDENTITY_URL) {
  throw new Error('please set REACT_APP_API_IDENTITY_URL env parameter');
}
const API_IDENTITY_URL = process.env.REACT_APP_API_IDENTITY_URL;

if (!process.env.REACT_APP_API_BFF_URL) {
  throw new Error('please set REACT_APP_API_BFF_URL env parameter');
}
const API_BFF_URL = process.env.REACT_APP_API_BFF_URL;

if (!process.env.REACT_APP_API_FREEPORT_URL) {
  throw new Error('please set REACT_APP_API_FREEPORT_URL env parameter');
}
const API_FREEPORT_URL = process.env.REACT_APP_API_FREEPORT_URL;

export {APP_ID, APP_TENANT_ID, API_IDENTITY_URL, API_BFF_URL, API_FREEPORT_URL};
