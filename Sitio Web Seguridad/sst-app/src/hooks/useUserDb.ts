import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, doc } from 'firebase/firestore'
import type { CollectionReference, DocumentReference, DocumentData } from 'firebase/firestore'

export function useUserDb() {
  const { user } = useAuth()

  const getCollection = (path: string): CollectionReference<DocumentData> => {
    if (!user) {
      throw new Error('No se puede obtener la colección porque el usuario no está autenticado.')
    }
    return collection(db, 'usuarios', user.uid, path)
  }

  const getDoc = (path: string, docId: string): DocumentReference<DocumentData> => {
    if (!user) {
      throw new Error('No se puede obtener el documento porque el usuario no está autenticado.')
    }
    return doc(db, 'usuarios', user.uid, path, docId)
  }

  return { getCollection, getDoc, user, userId: user?.uid }
}
