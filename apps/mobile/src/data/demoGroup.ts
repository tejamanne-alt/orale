import { Group, Member } from "@orale/shared";

export const DEMO_GROUP_ID = "demo-group";
export const DEMO_CURRENT_MEMBER_ID = "member-you";

export const DEMO_GROUP: Group = {
  id: DEMO_GROUP_ID,
  name: "The OG Crew",
  preset: "friends",
  memberIds: ["member-you", "member-priya", "member-ravi", "member-ana", "member-sam"],
  createdBy: "member-you",
  createdAt: "2026-01-01T00:00:00.000Z",
  timezone: "America/Los_Angeles",
};

export const DEMO_MEMBERS: Member[] = [
  { id: "member-you", displayName: "You", joinedAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-priya", displayName: "Priya", joinedAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-ravi", displayName: "Ravi", joinedAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-ana", displayName: "Ana", joinedAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-sam", displayName: "Sam", joinedAt: "2026-01-01T00:00:00.000Z" },
];
