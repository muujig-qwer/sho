import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Хэрвээ тухайн email бол admin гэж үзнэ
      if (token.email === "muujig165@gmail.com") {
        token.role = "admin"
      } else {
        token.role = "user"
      }
      return token
    },
    async session({ session, token }) {
      // Role-г session-д оруулна
      session.role = token.role
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
