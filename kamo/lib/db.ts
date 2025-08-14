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

  listAll(): ScheduledPost[] {
    return Array.from(this.posts.values()).sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }
}

// Persist across hot-reloads and route handler imports in dev by storing on globalThis.
declare global {
  // eslint-disable-next-line no-var
  var __KAMO_DB__: InMemoryDB | undefined;
}

export const db: InMemoryDB = globalThis.__KAMO_DB__ ?? new InMemoryDB();
globalThis.__KAMO_DB__ = db;

// Placeholder for future real DB integration (Prisma, Postgres, etc.)
// Replace InMemoryDB with a persistent implementation when ready.
