import express from "express";
import { db } from "#src/db/client.js";
import { runDBMigrations } from "#src/db/db-migrations.js";
import { infrastructureHealthRouter } from "#src/routes/infrastructure-health-router.js";

//Apply any new DB migrations to the DB before listing for new requests.
await runDBMigrations(db);

const app = express();
app.use(express.json());

app.use("/infrastructure-health", infrastructureHealthRouter);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
