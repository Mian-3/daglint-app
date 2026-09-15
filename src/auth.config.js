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
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      if (isAdminRoute) {
        if (!isLoggedIn) {
          return false;
        }
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
      }

      return true;
    },
  },
};