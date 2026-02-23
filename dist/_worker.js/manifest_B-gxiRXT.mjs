globalThis.process ??= {}; globalThis.process.env ??= {};
import { p as decodeKey } from './chunks/astro/server_D_5Vox22.mjs';
import './chunks/astro-designed-error-pages_DkWXfT94.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_2eoMyxWx.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/src/amgflooring/","cacheDir":"file:///D:/src/amgflooring/node_modules/.astro/","outDir":"file:///D:/src/amgflooring/dist/","srcDir":"file:///D:/src/amgflooring/src/","publicDir":"file:///D:/src/amgflooring/public/","buildClientDir":"file:///D:/src/amgflooring/dist/","buildServerDir":"file:///D:/src/amgflooring/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"gallery/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/gallery","isIndex":true,"type":"page","pattern":"^\\/gallery\\/?$","segments":[[{"content":"gallery","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/gallery/index.astro","pathname":"/gallery","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"service-area/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/service-area","isIndex":false,"type":"page","pattern":"^\\/service-area\\/?$","segments":[[{"content":"service-area","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/service-area.astro","pathname":"/service-area","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":true,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/index.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://amgflooring.us","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["D:/src/amgflooring/src/pages/gallery/[project].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/gallery/[project]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["D:/src/amgflooring/src/pages/gallery/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/gallery/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/src/amgflooring/src/pages/services/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/services/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/src/amgflooring/src/pages/about.astro",{"propagation":"none","containsHead":true}],["D:/src/amgflooring/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["D:/src/amgflooring/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/src/amgflooring/src/pages/service-area.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/gallery/[project]@_@astro":"pages/gallery/_project_.astro.mjs","\u0000@astro-page:src/pages/gallery/index@_@astro":"pages/gallery.astro.mjs","\u0000@astro-page:src/pages/service-area@_@astro":"pages/service-area.astro.mjs","\u0000@astro-page:src/pages/services/index@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_B-gxiRXT.mjs","D:/src/amgflooring/node_modules/astro/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","D:\\src\\amgflooring\\.astro\\content-assets.mjs":"chunks/content-assets_XqCgPAV2.mjs","D:\\src\\amgflooring\\.astro\\content-modules.mjs":"chunks/content-modules_Bvq7llv8.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DecHMJwP.mjs","D:/src/amgflooring/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BAYfvuUf.mjs","D:/src/amgflooring/src/components/Carousel":"_astro/Carousel.CHyO2vU0.js","@astrojs/react/client.js":"_astro/client.BJHgAj4G.js","D:/src/amgflooring/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.BkoFJ0Lt.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/src/amgflooring/src/components/Header.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"mobile-menu-btn\"),n=document.getElementById(\"mobile-menu\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"hidden\")});"]],"assets":["/_astro/about.Ckkv0n7M.css","/favicon.png","/robots.txt","/images/hero-image.jpg","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_astro/Carousel.CHyO2vU0.js","/_astro/client.BJHgAj4G.js","/_astro/index._OACqPSs.js","/images/services/bathroom.png","/images/services/carpet.png","/images/services/hardwood.png","/images/services/lvp.png","/images/services/stairs.png","/_worker.js/chunks/astro-designed-error-pages_DkWXfT94.mjs","/_worker.js/chunks/astro_CkUzClEx.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/content-assets_XqCgPAV2.mjs","/_worker.js/chunks/content-modules_Bvq7llv8.mjs","/_worker.js/chunks/index_uCXtpeIu.mjs","/_worker.js/chunks/Layout_D4NVHOp6.mjs","/_worker.js/chunks/noop-middleware_2eoMyxWx.mjs","/_worker.js/chunks/parse_CDBk4F85.mjs","/_worker.js/chunks/path_BgNISshD.mjs","/_worker.js/chunks/remote_CrdlObHx.mjs","/_worker.js/chunks/sharp_BAYfvuUf.mjs","/_worker.js/chunks/_@astro-renderers_CJWpin_4.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_DNVAVwK-.mjs","/_worker.js/chunks/_astro_assets_B27MrsDL.mjs","/_worker.js/chunks/_astro_content_WvHRb60r.mjs","/_worker.js/chunks/_astro_data-layer-content_DecHMJwP.mjs","/_worker.js/pages/about.astro.mjs","/_worker.js/pages/contact.astro.mjs","/_worker.js/pages/gallery.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/service-area.astro.mjs","/_worker.js/pages/services.astro.mjs","/_worker.js/_astro/about.Ckkv0n7M.css","/_worker.js/chunks/astro/server_D_5Vox22.mjs","/_worker.js/pages/gallery/_project_.astro.mjs","/about/index.html","/contact/index.html","/gallery/index.html","/service-area/index.html","/services/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"218Q5XB7i218cH1AAtY7p9kdLVmIsnA9Aql5a6CxXpI=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
