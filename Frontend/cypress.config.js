import { defineConfig } from "cypress";
import { seed } from "./prisma/seed-test";

export default defineConfig({
  e2e: {
    baseUrl : "http://localhost:5173",
    setupNodeEvents(on, config) {
      on('task', {
        async seedDatabase() {
          await seed();
          return null;
        }
      })
    },
  },
});