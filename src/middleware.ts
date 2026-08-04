import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  if (url.pathname === "/QA" || url.pathname === "/QA/") {
    return context.redirect("/qa", 301);
  }
  if (url.pathname === "/IOT" || url.pathname === "/IOT/") {
    return context.redirect("/iot", 301);
  }
  return next();
});
