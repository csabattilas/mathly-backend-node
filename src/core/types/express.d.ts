import { DecodedIdToken } from 'firebase-admin/auth'
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: DecodedIdToken
    }
  }
}
