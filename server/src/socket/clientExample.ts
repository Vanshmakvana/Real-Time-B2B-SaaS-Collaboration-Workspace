import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-workspace", "workspaceId123");
  socket.emit("join-channel", "channelId123");
});

socket.on("receive-message", (message) => {
  console.log("New message:", message);
});

socket.on("user-typing", (data) => {
  console.log(`${data.userName} is typing...`);
});

socket.on("message-read-update", (data) => {
  console.log("Message read:", data);
});

socket.on("workspace-invite", (invite) => {
  console.log("Workspace invite received:", invite);
});

socket.on("socket-error", (error) => {
  console.error("Socket error:", error);
});