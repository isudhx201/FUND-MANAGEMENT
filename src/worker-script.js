export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Try to fetch the exact asset
    let response = await env.ASSETS.fetch(request);

    // 2. If it's a 404 and it's not a static file (doesn't have an extension like .js, .css, .png)
    // then serve index.html for SPA routing.
    const isStaticAsset = path.includes('.') && !path.endsWith('.html');
    
    if (response.status === 404 && !isStaticAsset) {
      return env.ASSETS.fetch(new URL('/index.html', url.origin));
    }

    return response;
  },
};
