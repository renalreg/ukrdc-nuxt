interface AccessEvent {
  id: number;
  time: string;

  userId: string;
  clientId: string;
  userEmail: string;

  path: string;
  method: string;
  body: string;
}

export interface AuditEvent {
  id: number;
  accessEvent: AccessEvent;

  resource: string;
  resourceId: string;

  operation: string;

  children: AuditEvent[];

  identifiers: string[];
}
