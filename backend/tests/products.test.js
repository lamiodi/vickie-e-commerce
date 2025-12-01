import { jest } from "@jest/globals";
import request from "supertest";
jest.unstable_mockModule("../src/db/pool.js", () => ({
  pool: { query: async () => ({ rows: [{ id: "1", name: "Joggers", price: 59.99, category: "Joggers", variants: [] }] }) }
}));
const { default: app } = await import("../src/app.js");
describe("products list", () => {
  it("returns products", async () => {
    const res = await request(app).get("/api/products").query({ category: "Joggers", sort: "price_asc" });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].category).toBe("Joggers");
  });
});