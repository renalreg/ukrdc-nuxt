import { FacilityDetailsSchema } from "@ukkidney/ukrdc-axios-ts";

export function facilityLastMessageOver48(facility: FacilityDetailsSchema) {
  // True if the last message received was over 48 hours ago
  return (
    !facility.latestMessage.lastMessageReceivedAt ||
    new Date(facility.latestMessage.lastMessageReceivedAt).getTime() < new Date().setHours(new Date().getHours() - 48)
  );
}
