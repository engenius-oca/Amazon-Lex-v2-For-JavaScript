
// 入力ボックスにフォーカスを設定
document.getElementById("wisdom").focus();

// Amazon Cognito 認証情報を初期化
AWS.config.region = 'ap-northeast-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
// ここにプール ID を入力
    IdentityPoolId: 'ap-northeast-1:c9a7ff06-996a-430b-8bba-a270c925fd02',
});

var lexruntimev2 = new AWS.LexRuntimeV2();
var lexUserId = 'chatbot-demo' + Date.now();

const params = new URLSearchParams(location.hash.slice(1));
if(params.get("access_token") != null){
    tokens = params.get("access_token").split('.');
    const obj = JSON.parse(atob(tokens[1]));
    var sessionAttributes = obj['username']
    console.log(obj['username'])
}else{
    var sessionAttributes = "None";
    console.log("None")
}

function pushChat() {

    // 送信するテキストがある場合の処理
    var wisdomText = document.getElementById('wisdom');
    if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

        // 入力を無効にして、送信していることを示す
        var wisdom = wisdomText.value.trim();
        wisdomText.value = '';
        wisdomText.locked = true;

        // Lex ランタイムに送信
        var params = {
            botAliasId: 'TSTALIASID',
            botId: 'AIWMGUPGQN',
            text: wisdom,
            localeId: 'ja_JP',
            sessionId: sessionAttributes
        };
        showRequest(wisdom);
                        lexruntimev2.recognizeText(params, function (err, data) {
                                    if (err) console.log(err, err.stack); // エラーが発生しました
                                    else     showResponse(data);           // 正常な応答
                                        console.log(data);
                                });

    }
    // フォームの送信は常にキャンセルされる
    return false;
}

function showRequest(daText) {

    var conversationDiv = document.getElementById('conversation');
    var requestPara = document.createElement("P");
    requestPara.className = 'userRequest';
    requestPara.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(requestPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showError(daText) {

    var conversationDiv = document.getElementById('conversation');
    var errorPara = document.createElement("P");
    errorPara.className = 'lexError';
    errorPara.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(errorPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showResponse(lexResponse) {

        var conversationDiv = document.getElementById('conversation');
        var responsePara = document.createElement("P");
        responsePara.className = 'lexResponse';
        if (lexResponse.messages) {
                responsePara.appendChild(document.createTextNode(lexResponse.messages[0]['content']));
                responsePara.appendChild(document.createElement('br'));
        }
        if (lexResponse.dialogState === 'ReadyForFulfillment') {
                responsePara.appendChild(document.createTextNode(
                        'Ready for fulfillment'));
                // TODO:  show slot values
        } else {
                console.log(lexResponse['sessionState']);
                /* responsePara.appendChild(document.createTextNode(
                        '(' + lexResponse['sessionState']['originatingRequestId'] + ')')); */
        }
        conversationDiv.appendChild(responsePara);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;

        
}