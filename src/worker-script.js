export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Safety check for env.ASSETS
    if (!env.ASSETS) {
      return new Response("Configuration Error: env.ASSETS is not defined. Check your wrangler.json assets configuration.", { status: 500 });
    }

    try {
      // 1. Try to fetch the requested asset
      let response = await env.ASSETS.fetch(request);

      // 2. If it's a 404 (not found) and the request is not for a specific file (like .js, .png)
      //    we assume it's a Vue Router route and serve the main index.html file.
      if (response.status === 404 && !url.pathname.includes('.')) {
        // Construct a request for the root index.html
        const indexUrl = new URL('/index.html', url.origin);
        // We use a new Request to ensure headers/method are handled but the URL points to index.html
        response = await env.ASSETS.fetch(new Request(indexUrl, request));
      }

      return response;
    } catch (err) {
      // Catching the exception to prevent the ambiguous Error 1101
      return new Response("Worker Runtime Error: " + err.stack || err.message, { 
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  },
};
