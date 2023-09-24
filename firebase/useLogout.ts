import { useEffect, useState } from "react";
import { Auth } from "./init";

export const useLogout = () => {
  const [error, setError] = useState<string | null>(null);

  // function to logout the user when he click the button for example

  const logout = async () => {
    try {
      await Auth.signOut();

      // Dispatch logout action
    } catch (err: any) {
      setError(err.code);
    }
  };

  return { logout, error };
};
