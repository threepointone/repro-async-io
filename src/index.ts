type Env = {};

const promiseResolvers: (() => void)[] = [];

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

let ctr = 0;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    console.log("fetch", ctr++);
    if (ctr > 1) {
      console.log("reusing isolate");
    }
    const url = new URL(request.url);
    switch (`${request.method} ${url.pathname}`) {
      case "GET /": {
        new Promise<void>((resolve) => {
          promiseResolvers.push(resolve);
        });

        await sleep(5000);
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
