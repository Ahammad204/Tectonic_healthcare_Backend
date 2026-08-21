import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";
import { RedisClient } from "./app/lib/redis";
import { seedSuperAdmin } from "./app/utils/seed";

const PORT = config.port;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database successfully");
    await RedisClient.connect();
    console.log("Connected to redis successfully");
    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Only run in development or when explicitly called
if (process.env.NODE_ENV !== "production") {
  main();
}

// Export for Vercel serverless functions
export default app;
