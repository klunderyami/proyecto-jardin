import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Matchea todas las rutas excepto api/trpc/_next/_vercel, el panel /admin
  // y archivos con punto (favicon.ico, etc.).
  matcher: "/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)",
};