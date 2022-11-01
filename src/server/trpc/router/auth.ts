import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import serviceAccount from "../../../../serviceAccountKey.json";
import admin from "firebase-admin";
