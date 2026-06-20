export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "SUPERADMIN" | "editor";
}

export interface SessionResponse {
  user: SessionUser | null;
}
