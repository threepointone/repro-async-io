type Env = {};

const promiseResolvers: (() => void)[] = [];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    switch (`${request.method} ${url.pathname}`) {
      case "GET /": {
        await new Promise<void>((resolve) => {
          promiseResolvers.push(resolve);
        });
        // we will never actually get here since the previous
        // promise will never resolve
        return new Response("resolved");
      }
      case "GET /resolve": {
        // this throws uncaught exceptions
        promiseResolvers.forEach((resolve) => resolve());

        // so we do reach here
        return new Response("resolved all");
      }
      default: {
        return new Response("Not Found", { status: 404 });
      }
    }
  },
} satisfies ExportedHandler<Env>;
