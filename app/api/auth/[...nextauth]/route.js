import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: 10000, // Increase timeout to 10 seconds
      }
    }), 
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
         if (account.provider == "github" || account.provider == "google") {      
        //  connect to our database ,chai is the database name 
        // await connectDB();
        // here we find in our database that the user with this email is available or not
        // if not we create the user

        // let currentuser = await User.findOne({ "Email" : user.email })
        
        // if (!currentuser) {
        //   // here we create the new user
        //   let newuser = new User({
        //     "name": user.email.split("@")[0],
        //     "Email": user.email
            
        //   })
        //   await newuser.save()
        // }
        
      }
      // also return true to allow signIn
      return true
    },

    // this session callback is used to modify the session
    async session({ session, token, user }) {
     
    //  let myuser = await User.findOne({"Email":session.user.email})
     
    //  here we change the username as different user logged in
    // helps to modify our /[username] endpoint 
    //   session.user.name = myuser.name
      
      return session
    }
  }
})

export { authoptions as GET, authoptions as POST };