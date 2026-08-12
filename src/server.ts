import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";

const PORT = config.port;

const main = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

// Only run in development or when explicitly called
if (process.env.NODE_ENV !== 'production') {
    main();
}

// Export for Vercel serverless functions
export default app;