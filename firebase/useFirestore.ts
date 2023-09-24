import { Auth, db, timeStamp } from "./init";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import firestore from "@react-native-firebase/firestore";

export const useFirestore = (collectionNew: string, id: string) => {
  const user = useSelector((state: RootState) => state.user);

  // collection reference
  const ref = db.collection(collectionNew);

  // Add a document
  const addDocument = async (doc: any) => {
    try {
      if (user.uid !== null) {
        const createdAt = timeStamp;
        await ref
          .add({
            ...doc,
            createdAt,
            user: Auth.currentUser?.uid,
          })
          .then(() => {});
      }
    } catch (err: any) {
      return err.code;
    }
  };

  // Get a document
  const getDocument = async () => {
    let resp = null;
    try {
      resp = ref.where("user", "==", Auth.currentUser?.uid).get();

      return resp;
    } catch {}

    return resp;
  };

  // Update a document
  const updateDocument = async (newdoc: any, id: string) => {
    try {
      const updatedAt = timeStamp;
      const updatedDocument = ref
        .doc(id)
        .update({ ...newdoc, updatedAt })
        .then(() => {});
    } catch (err: any) {
      return err.code;
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      const docRef = ref.doc(id).delete();
    } catch (err: any) {
      return err.code;
    }
  };

  return { addDocument, getDocument, updateDocument, deleteDocument };
};
