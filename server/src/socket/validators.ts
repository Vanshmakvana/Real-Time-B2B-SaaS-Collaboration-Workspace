export const validateMessagePayload = (payload: any): boolean => {
  return (
    payload &&
    typeof payload.content === "string" &&
    payload.content.trim().length > 0 &&
    typeof payload.channelId === "string" &&
    typeof payload.workspaceId === "string"
  );
};

export const validateTypingPayload = (payload: any): boolean => {
  return (
    payload &&
    typeof payload.channelId === "string"
  );
};

export const validateReadReceiptPayload = (payload: any): boolean => {
  return (
    payload &&
    typeof payload.messageId === "string" &&
    typeof payload.channelId === "string"
  );
};