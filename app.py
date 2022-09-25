# Python標準ライブラリ
import json
import os
from datetime import timedelta 
import re

# サードパーティライブラリ
from flask import Flask, redirect, request, session ,jsonify, render_template
from flask_cors import CORS
from oauthlib.oauth2 import WebApplicationClient
import requests

app = Flask(__name__)
CORS(app)


# 設定情報
GOOGLE_CLIENT_ID = "573102128890-harbnki1ijrlpoutgnprvbr1qd3i90op.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# Flaskセットアップ
app = Flask(__name__)
#セッション情報を暗号化するためのキーを設定
app.secret_key = os.urandom(24)

# OAuth2クライアント設定
client = WebApplicationClient(GOOGLE_CLIENT_ID)

#https://shigeblog221.com/flask-session/
app.permanent_session_lifetime = timedelta(minutes=30)

@app.route("/")
def login():
    # 認証用のエンドポイントを取得する
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # ユーザプロファイルを取得するログイン要求
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@app.route("/callback")
def callback():
    # Googleから返却された認証コードを取得する
    code = request.args.get("code")

    #トークンを取得するためのURLを取得する
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # トークンを取得するための情報を生成し、送信する
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # トークンをparse
    client.parse_request_body_response(json.dumps(token_response.json()))

    # トークンができたので、GoogleからURLを見つけてヒットした、
    # Googleプロフィール画像やメールなどのユーザーのプロフィール情報を取得
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # メールが検証されていれば、名前、email、プロフィール画像を取得します
    if userinfo_response.json().get("email_verified"):
        users_email = userinfo_response.json()["email"]
    else:
        return "User email not available or not verified by Google.", 400

    domain = re.search("@[\w.]+", users_email)

    session["email-domain"] = domain.group()

    return users_email + "    " + domain.group()

@app.route("/session_check")
def login_():
  if "email-domain" in session:
    if session["email-domain"] == "@edu.oca.ac.jp":
        return session["email-domain"] + " ok"
    else:
        return session["email-domain"] + " not"
  return "none"

# @login_requiredデコレータは認証したいページに付ける

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

#デバッグ用
@app.route('/res', methods=['post'])
def registor():
    ques = request.form.get('question')
    print(ques)
    return jsonify(ques)

@app.route('/test')
def fuck():
    return render_template('top.html')



if __name__ == "__main__":
    app.run(ssl_context="adhoc")
