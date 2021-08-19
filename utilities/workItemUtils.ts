import { WorkItemExtended } from '~/interfaces/workitem'

export function workItemIsMergable(item: WorkItemExtended | undefined) {
  return (
    item &&
    item.type !== 9 &&
    item.incoming.masterRecords.length > 0 &&
    item.destination.masterRecord.nationalidType === 'UKRDC'
  )
}
