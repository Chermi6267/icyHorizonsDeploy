"use client";

import { io } from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
  path: `${process.env.NEXT_PUBLIC_SOCKET_PATH}`,
  transports: ["websocket"],
});
