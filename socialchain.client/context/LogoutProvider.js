import { createContext, useEffect, useState } from "react";

const LogoutContext = createContext({});

export const LogoutProvider =({children}) => {
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    useEffect(()=>{
        console.log(isLogoutLoading);
    },[isLogoutLoading])
    return (
        <LogoutContext.Provider value={{isLogoutLoading, setIsLogoutLoading}}>
            {children}
        </LogoutContext.Provider>
    )
}

export default LogoutContext;