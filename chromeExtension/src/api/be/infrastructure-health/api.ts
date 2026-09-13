import type { HealthStatus } from "@/types/infrastructure-health/infrastructure-health-types";
import { RestAPI } from "@/api/be/RestAPI";

export function checkServerHealth() {
  return RestAPI.Get<HealthStatus>("/infrastructure-health");
}

export function checkDbHealth() {
  return RestAPI.Get<HealthStatus>("/infrastructure-health/db");
}
