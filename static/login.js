const awsRegion = 'ap-northeast-1';
const domainPrefix = 'engenius'
const cognitoUserPoolId = 'uan5i4ogiblhle554m3gjt690sp80kmvin9rg5n9a85gh0mjeg6';
const cognitoAppClientId = '41o2dh4aemkpcfcvkh6utu95n';
const cognitoIdentityPoolId = 'ap-northeast-1_QfQXWNQXq';

//const thisUrl = "http://localhost:8000/index.html"; // for test
const thisUrl = `https://bcwvskcjj0.execute-api.ap-northeast-1.amazonaws.com/dev/cb`;

const cognitoDomainUrl = `https://${domainPrefix}.auth.${awsRegion}.amazoncognito.com`;
const cognitoLoginUrl = `${cognitoDomainUrl}/oauth2/authorize?response_type=code&client_id=${cognitoAppClientId}&redirect_uri=${thisUrl}`;
const cognitoLogoutUrl = `https://${domainPrefix}.auth.${awsRegion}.amazoncognito.com/logout?client_id=${cognitoAppClientId}&logout_uri=${thisUrl}`;

const logout = () => {
  location.href = cognitoLogoutUrl;
}

const idToken = (() => {
  const params = new URLSearchParams(location.hash.slice(1));
  return params.get("id_token");
})();

let username = '';

// if (idToken === null) {
//   location.href = cognitoLoginUrl;
// }

// Initialize the Amazon Cognito credentials provider
AWS.config.region = awsRegion;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoIdentityPoolId,
    Logins: {
      [`cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}`]: idToken,
    }
});

AWS.config.credentials.get(function() {
  const secretAccessKey = AWS.config.credentials.secretAccessKey;
  if (secretAccessKey === undefined) {
    location.href = cognitoLoginUrl;
  }
});

if (idToken !== null) {
  username = (() => {
    const tokens = idToken.split('.');
    const obj = JSON.parse(atob(tokens[1]));
    console.log(obj);
    return obj['cognito:username'];
  })();
}
