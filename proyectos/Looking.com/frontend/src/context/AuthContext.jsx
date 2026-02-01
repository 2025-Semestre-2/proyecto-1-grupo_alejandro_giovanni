import { createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // CAMBIAR DESPUES
  const session = {
    isLoggedIn: false,
    role: "guest",  // "guest", "user", "admin", "company_hosting", "company_entertainment"
    userId: "12",
    userName: "Juan Pérez",
    companyId: "34",
    companyName: "Hotel Las Montañas del Valle Central",
  };

  const isGuest = !session.isLoggedIn;
  const isUser = session.role === "user";
  const isAdmin = session.role === "admin";
  const isHostingCompany = session.role === "company_hosting";
  const isEntertainmentCompany = session.role === "company_entertainment";
  const isCompany = isHostingCompany || isEntertainmentCompany;
  const isUserLike = isUser || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        session,
        isGuest,
        isUser,
        isAdmin,
        isUserLike,
        isCompany,
        isHostingCompany,
        isEntertainmentCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
