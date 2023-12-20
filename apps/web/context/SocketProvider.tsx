"use client";

import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useContext,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

interface SocketProviderProps {
  children?: ReactNode;
}

interface ISocketContext {
  sendMessage: (message: string) => any;
  messages: string[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);

  if (!state) {
    throw new Error("State is not defined");
  }

  return state;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (message) => {
      console.log(message);
      if (socket) socket.emit("event:message", { message: message });
    },
    [socket]
  );

  const onMessageRecieved = useCallback((message: { message: string }) => {
    setMessages((prev) => [...prev, message.message]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    setSocket(_socket);
    _socket.on("message", onMessageRecieved);

    return () => {
      _socket.disconnect();
      setSocket(undefined);
      _socket.off("message", onMessageRecieved);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
