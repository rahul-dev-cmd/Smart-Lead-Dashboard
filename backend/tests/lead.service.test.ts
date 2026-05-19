import { describe, expect, it } from "vitest";
import { buildLeadQuery } from "../src/services/lead.service.js";

describe("buildLeadQuery", () => {
  it("combines owner scope, status, source, and partial search", () => {
    const filter = buildLeadQuery(
      {
        status: "Qualified",
        source: "Instagram",
        search: "Rahul",
        sort: "Latest",
        page: 2
      },
      {
        id: "507f1f77bcf86cd799439011",
        role: "Sales User"
      }
    ) as Record<string, unknown>;

    expect(filter.status).toBe("Qualified");
    expect(filter.source).toBe("Instagram");
    expect(filter.ownerId).toBeDefined();
    expect(Array.isArray(filter.$or)).toBe(true);
  });

  it("does not scope admin queries to an owner", () => {
    const filter = buildLeadQuery(
      {
        search: "",
        sort: "Oldest",
        page: 1
      },
      {
        id: "507f1f77bcf86cd799439011",
        role: "Admin"
      }
    ) as Record<string, unknown>;

    expect(filter.ownerId).toBeUndefined();
  });
});
