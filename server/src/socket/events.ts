export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  JOIN_WORKSPACE: "join-workspace",
  LEAVE_WORKSPACE: "leave-workspace",
  WORKSPACE_JOINED: "workspace-joined",
  WORKSPACE_LEFT: "workspace-left",

  JOIN_CHANNEL: "join-channel",
  LEAVE_CHANNEL: "leave-channel",
  CHANNEL_JOINED: "channel-joined",
  CHANNEL_LEFT: "channel-left",

  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",

  TYPING: "typing",
  USER_TYPING: "user-typing",
  STOP_TYPING: "stop-typing",
  USER_STOP_TYPING: "user-stop-typing",

  MESSAGE_READ: "message-read",
  MESSAGE_READ_UPDATE: "message-read-update",

  USER_ONLINE: "user-online",
  USER_OFFLINE: "user-offline",
  ONLINE_USERS: "online-users",

  WORKSPACE_INVITE: "workspace-invite",
  CHANNEL_ACTIVITY: "channel-activity",

  SOCKET_ERROR: "socket-error",
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];