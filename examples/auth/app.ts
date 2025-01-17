import { App, Context } from "alosaur/mod.ts";
import { AccountArea } from "./areas/account/account.area.ts";
import { HomeArea } from "./areas/home/home.area.ts";
import { AuthMiddleware } from "alosaur/src/security/authorization/src/auth.middleware.ts";
import { CookiesAuthentication } from "alosaur/src/security/authentication/cookies/src/cookies-authentication.ts";
import { SessionMiddleware } from "alosaur/src/security/session/src/session.middleware.ts";
import { MemoryStore } from "alosaur/src/security/session/src/store/memory.store.ts";
import { SecurityContext } from "alosaur/src/security/context/security-context.ts";

const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

const app = new App({
  areas: [AccountArea, HomeArea],
  logging: false,
  providers: [{
    token: Context,
    useClass: SecurityContext,
  }],
});

const sessionStore = new MemoryStore();
await sessionStore.init();

const authMiddleware = new AuthMiddleware(
  [CookiesAuthentication.DefaultScheme],
);
const sessionMiddleware = new SessionMiddleware(
  sessionStore,
  { secret: 1122n, maxAge: DAYS_30, path: "/" },
);

app.use(new RegExp("/"), sessionMiddleware);
app.use(new RegExp("/"), authMiddleware);

app.listen();
