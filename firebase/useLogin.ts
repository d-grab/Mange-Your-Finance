import { useDispatch } from "react-redux";
import { login as LoginState } from "../store/slices/userSlice";
import { Auth } from "./init";

export const useLogin = () => {
  // redux toolkit
  const dispatch = useDispatch();


  const login = async (email: string, password: string) => {
    const { user } = await Auth.signInWithEmailAndPassword(email, password);

    // dispatch
    dispatch(
      LoginState({
        name: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      })
    );
  };

  return { login };
};
