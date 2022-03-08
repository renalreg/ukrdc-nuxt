interface TrackableTaskLinks {
  self: string;
}

export interface TrackableTask {
  id: string;
  name: string;
  visibility: "public" | "private";
  owner: string;
  status: "pending" | "running" | "finished" | "failed";
  error: string;

  created: string;
  started: string;
  finished: string;

  links: TrackableTaskLinks;
}
