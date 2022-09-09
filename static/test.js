window.onload = function() {
  // 計算ボタンを押した際の動作を設定
  document.getElementById('calc_button').onclick = function() {
    post();
  };
};

function post() {
  var quesdata = {
    question: document.getElementById('question').value,
  };

  $.ajax({
    type: "post",
    url: "https://127.0.0.1:5000/res",
    data: quesdata,
    //Ajax通信が成功した場合
    success: function(data, dataType)
      {
        //PHPから返ってきたデータの表示
        document.getElementById('answer').value=data;

        //送信完了後フォームの内容をリセット
        if(data == "success"){
          document.getElementById('question').value="";
        }
        },
       //Ajax通信が失敗した場合のメッセージ
        error: function()
        {
          alert('メールの送信が失敗しました。');
        }
  });
}
