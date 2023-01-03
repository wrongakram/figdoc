import { createContext, useMemo, useContext, useState } from "react";

const ToastContext = createContext({});

export const ToastProvider = ({ children }: any) => {
  const [createDesignSystemToast, setCreateDesignSystemToast] = useState(false);

  return (
    <ToastContext.Provider
      value={{ createDesignSystemToast, setCreateDesignSystemToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export function useToastStore() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("You forgot to wrap ToastStoreProvider");
  }

  return context;
}
