export type GroupPreset = "friends" | "family" | "mixed";

export interface Member {
  id: string;
  displayName: string;
  avatarUrl?: string;
  /** ISO timestamp of when this member accepted their invite. */
  joinedAt: string;
}

export interface Invite {
  id: string;
  groupId: string;
  invitedBy: string;
  inviteeContact: string;
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  preset: GroupPreset;
  memberIds: string[];
  createdBy: string;
  createdAt: string;
  /** IANA timezone used to compute "today's chest" resets for this group. */
  timezone: string;
}
