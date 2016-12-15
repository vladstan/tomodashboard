function getAccessToken() {
  return window.localStorage.getItem('access_token');
}

function removeAccessToken() {
  return window.localStorage.removeItem('access_token');
}

function isLoggedIn() {
  return !!getAccessToken();
}

export default {
  getAccessToken,
  removeAccessToken,
  isLoggedIn,
};
