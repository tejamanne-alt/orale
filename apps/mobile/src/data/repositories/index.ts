import { env } from "../../config/env";
import { FirebaseRouletteRepository } from "./firebaseRouletteRepository";
import { MockRouletteRepository } from "./mockRouletteRepository";
import { RouletteRepository } from "./RouletteRepository";

let repository: RouletteRepository | undefined;

export function getRouletteRepository(): RouletteRepository {
  if (!repository) {
    repository =
      env.dataBackend === "firebase"
        ? new FirebaseRouletteRepository()
        : new MockRouletteRepository();
  }
  return repository;
}

export type { RouletteRepository } from "./RouletteRepository";
