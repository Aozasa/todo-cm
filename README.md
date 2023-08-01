# ToDo アプリ README

## はじめに

ToDo を管理するためのアプリケーションです。以下の機能を実装しています。  
詳細な仕様は docs/api-document.yaml に OpenAPI の形式で記述しています。
簡易版として HTML も用意していますので見やすい方で確認をしてください。

- ユーザ登録
- ログイン
- ログアウト
- トークンリフレッシュ
- トークン検証
- ToDo 登録
- ToDo 一覧
- ToDo 更新
- ToDo 削除

## 構成

- バックエンドアプリ
  - 言語：typescript
  - サーバフレームワーク：express.js(node.js)
  - DB：Postgres 15.3
  - ORM: prisma
  - アーキテクチャ：MVC
- インフラ
  - ローカル
    - docker(compose)
  - 本番 AWS(想定)
    - DB：RDS
    - サーバ：app runner
    - イメージレジストリ：ECR
    - 認証：Cognito

## ローカル環境構築手順

前提として docker、docker compose が利用できる環境を準備してください。

1. .env.sample を参考に AWS の接続情報を記した.env ファイルを backend フォルダ配下に配置します。(接続情報は別途送付します。)
2. backend フォルダへ移動し、DB のマイグレーションを行います。

```
  $ cd backend && docker-compose run -it --rm todo_backend npx prisma migrate dev
```

3. システムを起動します。

```
  $ docker-compose up -d
```

4. localhost:8080 でサーバにアクセスができます。curl コマンド等で利用してください。

## システムの動作確認手順

1. ユーザ登録を行います。今回はユーザ名とパスワードだけで登録できます。パスワードは半角英小文字と数字の組み合わせで 8 文字以上で指定してください。role を admin にすると全てのユーザの ToDo の CRUD が可能になります。

```
  $ curl http://localhost:8080/api/users -X POST -H 'Content-Type: application/json' -d '{"username": "ユーザ名", "password": "パスワード", "role": "general"}'
```

```
  {"status":200,"user":{"username":"ユーザ名","id":"ユーザID","role":"general"}}
```

2. ログインを行います。

```
  $ curl http://localhost:8080/api/sessions -X POST -H 'Content-Type: application/json' -d '{"username": "ユーザ名", "password": "パスワード" }'
```

```
  {"status":200,"session":{"token":"トークン",refreshToken":"リフレッシュトークン
  "}}
```

3. トークンの有効期限は 60 分です。期限切れの場合は再度ログインするかリフレッシュトークンでトークンを再発行してください。

```
  $ curl http://localhost:8080/api/sessions/refresh -X POST -H 'Content-Type: application/json' -d '{"username": "ユーザ名", "refreshToken": "2で取得したリフレッシュトークン" }'
```

```
{"status":200,"session":{"token":"再発行したトークン"}}
```

4. ToDo の登録を行います。

```
  curl http://localhost:8080/api/todos -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer トークン' -d '{"title": "Todo test", "description": "テスト用のToDOです。","closedAt": "2023/09/30", "priority": "HIGH", "username": "ユーザ名"}'
```

5. ToDo の一覧取得を行います。

```
  curl http://localhost:8080/api/todos  -H 'Authorization: Bearer トークン'
```

```
  {"status":200,"todos":[{"id":18,"title":"Todo test","description":"テスト用のToDOです。","isClosed":false,"closedAt":"2023-09-30T00:00:00.000Z","finishedAt":null,"priority":"HIGH","username":"AozasaSeiya2","createdAt":"2023-08-01T02:09:11.215Z","updatedAt":"2023-08-01T02:09:11.215Z"},{"id":21,"title":"Todo test2","description":"テスト用のToDOです。","isClosed":false,"closedAt":"2023-09-30T00:00:00.000Z","finishedAt":null,"priority":"HIGH","username":"AozasaSeiya2","createdAt":"2023-08-01T02:11:38.221Z","updatedAt":"2023-08-01T02:11:38.221Z"}]}
```

6. ToDo の更新を行います。

```
  curl http://localhost:8080/api/todos/更新するToDoのID -X PATCH -H 'Content-Type: application/json' -H 'Authorization: Bearer トークン' -d '{"description": "更新しました。"}'
```

```
  {"status":200,"todo":{"id":18,"title":"Todo test","description":"更新しました。","isClosed":false,"closedAt":"2023-09-30T00:00:00.000Z","finishedAt":null,"priority":"HIGH","username":"AozasaSeiya2","createdAt":"2023-08-01T02:09:11.215Z","updatedAt":"2023-08-01T02:30:12.450Z"}}
```

7. ToDo の削除を行います。

```
  curl http://localhost:8080/api/todos/削除するToDoのID -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer トークン'
```

```
  {"status":200}
```

## テストの実行方法

以下のコマンドを実行して下さい。

```
  cd backend && docker-compose exec -u node todo_backend npm test
```

coverage ファイルを出力する場合はこちらを実行してください

```
  cd backend && docker-compose exec -u node todo_backend npm test --coverage
```
