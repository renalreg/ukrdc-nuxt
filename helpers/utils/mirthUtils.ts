import { ConnectorMessageModel, MirthChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

export function messageHasErrors(message: MirthChannelMessageModel): boolean {
  for (const msg of Object.values(message.connectorMessages)) {
    if (msg.errorCode !== 0) {
      return true;
    } else if (msg.metaDataMap?.ERROR) {
      return true;
    }
  }
  return false;
}

export function connectorMessageError(connectorMessage: ConnectorMessageModel) {
  if (connectorMessage.metaDataMap?.ERROR) {
    return connectorMessage.metaDataMap.ERROR;
  } else if (connectorMessage.errorCode !== 0) {
    return `Error code ${connectorMessage.errorCode}`;
  }
  return null;
}
