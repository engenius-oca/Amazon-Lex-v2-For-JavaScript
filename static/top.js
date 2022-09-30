// エンターキーを押したときの処理
document.onkeypress = function(e) {
  if (e.key === 'Enter') {
      return post();
  }
}

// ロボットの返答内容
const chat = [
  '学校案内チャットボットへようこそ!',
  'OCAに関する質問を受け付けています。',
];

const chatBtn = document.getElementById('chat-button');

function post() {
  const inputText = document.getElementById('chat-input').value

  var quesdata = {
    question: inputText,
  };

  if (!inputText) {
    return false;
  }

  output(inputText, "me", "txt");

  $.ajax({
    type: "post",
    url: "https://127.0.0.1:5000/res",
    data: quesdata,
    //Ajax通信が成功した場合
    success: function(data, dataType)
      {
        //PHPから返ってきたデータの表示
        // document.getElementById('answer').value=data;
        output(data, "robot", "txt");
        document.getElementById('chat-input').value="";

        //送信完了後フォームの内容をリセット
        if(data == "success"){
          // 一応メッセージによる処理の欄を置いとく
          output("OK!!!", "robot", "txt");
        } else {
          output("NO!!!", "robot", "txt");
        }
      },
      //Ajax通信が失敗した場合のメッセージ
      error: function()
      {
        alert('メッセージの送信が失敗しました。');
      }
  });
}


// 画面への出力
// valはメッセージ内容，personは誰が話しているか
function output(val, person, style) {
  // 一番下までスクロール
  const field = document.getElementById('field');
  field.scroll(0, field.scrollHeight - field.clientHeight);

  const ul = document.getElementById('chat-ul');
  const li = document.createElement('li');
  // このdivにテキストを指定
  const div = document.createElement('div');
  div.textContent = val;


  const img_ele = document.createElement('img');
  img_ele.src = 'images/AEON.png';
  img_ele.alt = '階層図';
  img_ele.width = 150;
  img_ele.height = 150;
  
  if (person == "me") { // 自分
      div.classList.add('chat-right');
      li.classList.add('right');
      ul.appendChild(li);
      li.appendChild(div);
  } else if (person == "robot") { // 相手
      // ロボットが2個連続で返信してくる時、その間は返信不可にする
      // なぜなら、自分の返信を複数受け取ったことになり、その全てに返信してきてしまうから
      // 例："Hi!〇〇!"を複数など（今回のロボットの連続返信は2個以内とする）
      chatBtn.disabled = true;
      // 時間切れになると処理を実行
      setTimeout( ()=> {
          chatBtn.disabled = false;
          li.classList.add('left');
          div.classList.add('chat-left');
          ul.appendChild(li);
          if (style == "txt") {
              li.appendChild(div);
          } else {
              li.appendChild(img_ele);
          }
      }, 2000); 
  }
}
