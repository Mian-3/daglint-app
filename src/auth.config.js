export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      // API routes handle their own authentication — never redirect them
      if (path.startsWith("/api")) {
        return true;
      }

      // Admin section always requires an ADMIN role
      if (path.startsWith("/admin")) {
        if (!isLoggedIn) {
          return false;
        }
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      // Coming Soon mode: hide the storefront from everyone except admins
      const comingSoonEnabled = process.env.COMING_SOON === "true";
      if (comingSoonEnabled && path !== "/coming-soon") {
        if (userRole === "ADMIN") {
          return true;
        }
        return Response.redirect(new URL("/coming-soon", request.nextUrl));
      }

      return true;
    },
  },
};