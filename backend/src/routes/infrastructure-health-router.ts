import { Router } from "express";
import {
  checkDbHealth,
} from "#src/controllers/infrastructure-health-controllers/check-db-health.js";
import { checkServerHealth } from "#src/controllers/infrastructure-health-controllers/check-server-health.js";

export const infrastructureHealthRouter = Router();

infrastructureHealthRouter.get("/", checkServerHealth);
infrastructureHealthRouter.get("/db", checkDbHealth);
