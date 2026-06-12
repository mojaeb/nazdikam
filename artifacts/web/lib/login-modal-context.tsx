import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface LoginModalContextValue {
  isOpen: boolean;
  show: () => void;
  hide: () => void;
}

const LoginModalContext = createContext<LoginModalContextValue>({
  isOpen: false,
  show: () => {},
  hide: () => {},
});

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback(() => setIsOpen(true), []);
  const hide = useCallback(() => setIsOpen(false), []);

  return (
    <LoginModalContext.Provider value={{ isOpen, show, hide }}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  return useContext(LoginModalContext);
}
