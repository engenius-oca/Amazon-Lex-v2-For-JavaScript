const idToken = (() => {
  const params = new URLSearchParams(location.hash.slice(1));
  return params.get("access_token");
})();

const tokens = idToken.split('.');
const obj = JSON.parse(atob(tokens[1]));

console.log(obj['username'])
