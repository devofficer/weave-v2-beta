import { createRouter } from "server/createRouter";
import { strategiesRouter } from "./strategies.router";
import { farmsRouter } from "./farms.router";
import { tokensRouter } from "./tokens.router";
import { commentsRouter } from "./comments.router";

export const appRouter = createRouter()
  .merge('strategies.', strategiesRouter)
  .merge('farms.', farmsRouter)
  .merge('tokens.', tokensRouter)
  .merge('comments.', commentsRouter)

export type AppRouter = typeof appRouter;