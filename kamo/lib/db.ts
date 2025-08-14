export type ScheduledPost = {
  id: string;
  content: string;
  scheduledAt: string; // ISO timestamp
  createdAt: string;   // ISO timestamp
  status: "pending" | "posted" | "failed";
  error?: string;
};

class InMemoryDB {
  private posts: Map<string, ScheduledPost> = new Map();

  create(post: Omit<ScheduledPost, "createdAt" | "status">): ScheduledPost {
    const created: ScheduledPost = {
      ...post,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    this.posts.set(created.id, created);
    return created;
  }

  getDue(nowISO: string): ScheduledPost[] {
    const now = new Date(nowISO).getTime();
    return Array.from(this.posts.values()).filter(
      (p) => p.status === "pending" && new Date(p.scheduledAt).getTime() <= now
    );
  }

  update(id: string, patch: Partial<ScheduledPost>): ScheduledPost | undefined {
    const existing = this.posts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    this.posts.set(id, updated);
    return updated;
  }

  get(id: string): ScheduledPost | undefined {
    return this.posts.get(id);
  }
}

export const db = new InMemoryDB();

// Placeholder for future real DB integration (Prisma, Postgres, etc.)
// Replace InMemoryDB with a persistent implementation when ready.
