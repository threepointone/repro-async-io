declare global {
  var resolve: () => void;
}

async function setupWaiter(ctx: ExecutionContext) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, 1000);
  ctx.waitUntil(promise);
}

export default {
  async fetch(req, env, ctx) {
    if (globalThis.resolve === undefined) {
      setupWaiter(ctx);
      const { promise, resolve } = Promise.withResolvers<void>();
      globalThis.resolve = resolve;
      const ab = AbortSignal.abort();
      await promise;
      ab.aborted;
      return new Response("ok");
    }

    globalThis.resolve();
    return new Response("ok");
  },
} satisfies ExportedHandler;
