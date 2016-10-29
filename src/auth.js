module.exports = {
  getToken() {
    return typeof window != 'undefined' && window.localStorage.token || null;
  },

  // logout(cb) {
  //   if (window.localStorage) {
  //     delete window.localStorage.token;
  //   }
  //
  //
  //   this.onChange(false);
  // },

  loggedIn() {
    return !!(typeof window != 'undefined' && window.localStorage.token) || false;
  }
};
