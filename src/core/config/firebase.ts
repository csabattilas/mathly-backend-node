import * as admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

const projectId = process.env.FIREBASE_PROJECT_ID
if (!projectId) {
  console.warn('FIREBASE_PROJECT_ID is not set. Firebase authentication will not work properly.')
}

let firebaseConfig: admin.AppOptions = {}

if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  console.log('Using Firebase service account credentials')
  firebaseConfig = {
    credential: admin.credential.cert({
      projectId: projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  }
} else {
  console.log('Using Firebase application default credentials')
  firebaseConfig = {
    projectId: projectId,
    credential: admin.credential.applicationDefault(),
  }
}

const app = admin.initializeApp(firebaseConfig)

export const auth = app.auth()
export default app
