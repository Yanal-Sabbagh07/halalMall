import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                username:{
                    label: "User Name",
                    type: "text",
                    placeholder:"Your User Name"
                },
                password:{
                    label:"Password",
                    type:"password",
                    placeholder:"Your Password",
                }
            },
            async authorize(credentials){ //
                const user = await prisma.user.findUnique({
                    where:{
                        email:credentials?.username,
                    },
                });
                if(!user){
                    throw new Error("User Name or Password is not Correct");
                }
                // hashing the password
                if(!credentials?.password) throw new Error("Please Provide Your Password");
                const isPasswordCorrect = await  bcrypt.compare(credentials.password, user.password);
                if(!isPasswordCorrect) throw new Error("User Name or Password is not Correct");
                const {password, ...userWithoutPass} = user ;
                return userWithoutPass;
            },
        }),
    ],
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST };