## firebase setup
https://github.com/GomaGoma676/nextjs-hasura-firebase-react-query

コンソールから
firebase init

1.functions～を選択
2.depenciesは Y

## hasura の設定
firebase functions:config:set hasura.url="{hasura endpoint}" hasura.admin_secret="{HASURA_GRAPHQL_ADMIN_SECRET}"

## functionsフォルダ => index.ts

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const setCustomClaims = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'staff',
      'x-hasura-allowed-roles': ['staff'],
      'x-hasura-user-id': user.uid,
    },
  }
  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims)
    await admin.firestore().collection('user_meta').doc(user.uid).create({
      refreshTime: admin.firestore.FieldValue.serverTimestamp(),
    })
  } catch (e) {
    console.log(e)
  }
})

## firebaseに上記設定をデプロイ
firebase deploy --only functions

## hasura jwt config
https://hasura.io/jwt-config/

provider:
firebase

projectId:
firebase projectId

hasura new env vars:
・HASURA_GRAPHQL_JWT_SECRETに上記で生成したコードをはりつけ
・HASURA_GRAPHQL_UNAUTHORIZED_ROLE => permission で作成した認証なしのroleをはりつけ


## cloud firestore rule

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/{userId} {
    match /user_meta/ {
      allow read, write: if request.auth != null && userId == request.auth.uid;
    }
  }
}
