import { useEffect, useState } from 'react';

export function useLeituraWebSocket() {
  const [leitura, setLeitura] = useState("00");

  useEffect(() => {
    const socket = new WebSocket("ws://10.0.2.2:5000");

    socket.onopen = () => {
      console.log("Conexão WebSocket estabelecida");
    };

    socket.onmessage = (event) => {
      console.log("Nova leitura recebida:", event.data);
      setLeitura(event.data);
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error.message);
    };

    socket.onclose = () => {
      console.log("Conexão WebSocket fechada");
    };

    return () => {
      socket.close();
    };
  }, []);

  return leitura;
}
