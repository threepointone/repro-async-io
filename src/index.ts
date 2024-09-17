type Env = {};

const promiseResolvers: (() => void)[] = [];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    switch (`${request.method} ${url.pathname}`) {
      case "GET /": {
        await new Promise<void>((resolve) => {
          promiseResolvers.push(resolve);
        }).then(() => {
          return new Response("resolved");
        });
      }
      case "GET /resolve": {
        promiseResolvers.forEach((resolve) => resolve());
        return new Response("Resolved");
      }
      default: {
        return new Response("Not Found", { status: 404 });
      }
    }
  },
} satisfies ExportedHandler<Env>;
