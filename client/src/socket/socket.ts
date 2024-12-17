"use client";

import { io } from "socket.io-client";

export const socket = io(`wss://chermi6267.ru`, {
    path: "/my_api/socket.io",
    transports: ["websocket"],
});

