import LogoutContext from "@/context/LogoutProvider";
import { useContext } from "react";

export default function useLogoutLoading() {
    return useContext(LogoutContext);
  }