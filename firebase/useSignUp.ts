import { useState } from "react";

//firebase imports
import { Auth } from "./init";
// react redux
import { useDispatch } from "react-redux";
import { login as LoginState } from "../store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSignUp = () => {
  const dispatch = useDispatch();

  //creating Signup function to import it in other component
  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const { user } = await Auth.createUserWithEmailAndPassword(email, password);

    // dispatch
    dispatch(
      LoginState({
        name: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      })
    );

    //add display name for the user
    const update = {
      displayName: displayName,
    };

    await Auth.currentUser?.updateProfile(update);
  };

  return { signup };
};
