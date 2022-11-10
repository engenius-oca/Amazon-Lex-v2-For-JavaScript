const awsRegion = 'ap-northeast-1';
const domainPrefix = 'engenius'
const cognitoUserPoolId = 'ap-northeast-1_QfQXWNQXq';
const cognitoAppClientId = '41o2dh4aemkpcfcvkh6utu95n';
const cognitoIdentityPoolId = 'ap-northeast-1:c9a7ff06-996a-430b-8bba-a270c925fd02';

const thisUrl = `https://d2tlhflz5yzmtn.cloudfront.net/index.html`;

const cognitoDomainUrl = `https://${domainPrefix}.auth.${awsRegion}.amazoncognito.com`;
const cognitoLoginUrl = `${cognitoDomainUrl}/oauth2/authorize?response_type=code&client_id=${cognitoAppClientId}&redirect_uri=${thisUrl}`;
const cognitoLogoutUrl = `https://${domainPrefix}.auth.${awsRegion}.amazoncognito.com/logout?client_id=${cognitoAppClientId}&logout_uri=${thisUrl}`;

const logout = () => {
  location.href = cognitoLogoutUrl;
}

// const idToken = (() => {
//   var params = new URL(window.location.href).searchParams

//   if(params.get('code') != null){
//       console.log("YES")
//   }else{
//       console.log("NO")
//   }
//   return params.get('code');
// })();

const idToken = (() => {
  const params = new URLSearchParams(location.hash.slice(1));
  return params.get("access_token");
})();

let username = '';

// if (idToken === null) {
//   location.href = cognitoLoginUrl;
// }

// Initialize the Amazon Cognito credentials provider

console.log(idToken)

// AWS.config.region = awsRegion;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoIdentityPoolId,
    Logins: {
      [`cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}`]: idToken,
    },
    region: awsRegion
});

AWS.config.credentials.get(function() {
  const secretAccessKey = AWS.config.credentials.secretAccessKey;
  // if (secretAccessKey === undefined) {
  //   location.href = cognitoLoginUrl;
  // }
  console.log(secretAccessKey);
});

// if (idToken !== null) {
//   username = (() => {
//     const tokens = idToken.split('.');
//     const obj = JSON.parse(atob(tokens[1]));
//     return obj;
//   })();
// }

