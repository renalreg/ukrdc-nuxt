import checkIE from "check-ie";
import { Context } from "@nuxt/types";

export default function (context: Context) {
  const ua = process.server ? context.ssrContext?.req.headers["user-agent"] : window.navigator.userAgent;

  if (ua) {
    const isIE = checkIE(ua, {
      ie10: true,
      ie11: true,
      edge: false, // Detect Internet Explorer, but not Edge
    }).isIE;
    if (isIE) {
      context.redirect("/unsupported.html");
    }
  }
}
