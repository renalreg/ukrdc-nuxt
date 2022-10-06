/*
USEFUL RULES FOR WORKITEMS

Type 9:
- Person ID always 999999999, no real incoming Person record
- WorkItem based entirely on attributes + "destination" master record
- Always an NHS/CHI/HSC destination record

Type 7:
- Always an NHS/CHI/HSC destination record
- Usually raised in a pair with a type 6
  - The type 7 is not mergable, and should be closed after the type 6 is merged

Type 6:
- Always a UKRDC destination record
- Usually raised in a pair with a type 7
  - The type 6 is mergable (both incoming and destination are UKRDC records)

Type 4:
- Always an NHS/CHI/HSC destination record
- Usually raised in a pair with a type 3
  - The type 4 is not mergable, and should be closed after the type 3 is merged

Type 3:
- Always a UKRDC destination record
- Usually raised in a pair with a type 4
  - The type 3 is mergable (both incoming and destination are UKRDC records)


NOMENCLATURE:

I'm considering a "secondary" workitem as one in a collection of workitems raised
by the same event, which requires others in the collection to be resolved before closing.

I'm considering a "primary" workitem as one in a collection of workitems raised
by the same event, which can be resolved without the others.

*/

import { WorkItemExtendedSchema, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";

export function workItemIsOpen(item: WorkItemSchema): Boolean {
  return item?.status !== 3;
}

export function workItemIsUKRDC(item: WorkItemSchema) {
  return item?.type === 3 || item?.type === 6;
}

export function workItemIsMergable(item: WorkItemExtendedSchema): Boolean {
  // Check if a workitem can be merged (incoming and destination UKRDC records)
  return (
    workItemIsUKRDC(item) &&
    item.incoming?.masterRecords?.length !== undefined &&
    item.incoming?.masterRecords?.length > 0 &&
    !!item.destination.masterRecord
  );
}

export function workItemIsSecondary(item: WorkItemExtendedSchema, related: WorkItemSchema[]) {
  // Check if a workitem should be treated as secondary to others in the collection
  if (workItemIsMergable(item)) {
    // Mergable workitems are always "primary"
    return false;
  }
  // For each related Work Item in the collection
  for (const relatedItem of related) {
    // If the related Work Item is a mergable UKRDC Work Item
    if (workItemIsUKRDC(relatedItem) && workItemIsOpen(relatedItem)) {
      return true;
    }
  }
  // If no items in the collection need to be resolved, this is a "primary" workitem
  return false;
}

export function collectionIsUnresolved(related: WorkItemSchema[]) {
  // For each related Work Item in the collection
  for (const relatedItem of related) {
    // If the related Work Item is a mergable UKRDC Work Item
    if (workItemIsOpen(relatedItem)) {
      return true;
    }
  }
  return false;
}

export function formatAttributeValue(attributeString: String) {
  const splitString = attributeString.split(":");
  if (splitString.length > 1) {
    return `${attributeString.split(":")[0]} (incoming) → ${attributeString.split(":")[1]} (current)`;
  } else {
    return attributeString.split(":")[0];
  }
}
