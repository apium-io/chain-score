import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Worldcoin",
      credentials: {
        verificationData: { label: "Verification Data", type: "text" },
      },
      async authorize(credentials: any) {
        const verificationData = credentials.verificationData;

        // Here you can handle the verificationData, such as saving it to your DB or modifying session
        if (verificationData) {
          return { id: "worldcoin", verificationData };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      // Add the verification data to the session
      if (token.verificationData) {
        session.verificationData = token.verificationData;
      }
      return session;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      // Store Worldcoin verification data in JWT token
      if (user?.verificationData) {
        token.verificationData = user.verificationData;
      }
      return token;
    }
  }
});
