import { MessageSchema } from "@ukkidney/ukrdc-axios-ts";

export const allStatuses = ["STORED", "RECEIVED", "ERROR", "RESOLVED"];

export function MessageSummary(message: MessageSchema): string {
  if (message.msgStatus === "STORED") {
    return "Stored without error";
  }
  if (message.msgStatus === "RECEIVED") {
    return "Received without error";
  }
  if (message.msgStatus === "ERROR" || message.msgStatus === "RESOLVED") {
    if (message.error) {
      return message.error.split("\n")[0];
    } else {
      return "No error message recorded";
    }
  }
  return "Unknown message status";
}
