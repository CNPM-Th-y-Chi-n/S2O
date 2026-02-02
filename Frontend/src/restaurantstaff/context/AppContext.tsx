import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "manager" | "staff" | "kitchen";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  restaurantName: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        restaurantName: "The Golden Fork",
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
