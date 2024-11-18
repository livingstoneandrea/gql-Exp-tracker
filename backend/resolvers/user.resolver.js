
import User from '../models/user.model.js'

const userResolver = {
    Query: {
        authUser:async (_parent, _args,context)=>{
            try {
                const user = await context.getUser()
                return user
            } catch (err) {
                console.error("Error in authUser: ", err);
                throw new Error("Internal server error");
                
            }
        },
        user:async (_,_args, {userId},)=>{
            try {
                const user = await User.findById(userId)
                return user
            } catch (err) {
                console.error("Error in user query: ", err);
                throw new Error( err.message ||"Error in getting user");
            }
            
        }
        //Todo => add user / transaction relations

    },

    Mutation:{
        signUp: async (_, {input}, context)=>{
            try {
                const {username, name, password, gender}= input

                if (!username || !name || !password || !gender) {
                    throw new Error("All fields are required")
                }
                const existingUser = await User.findOne({username})
                if (existingUser) {
                    throw new Error("User already exists")
                }
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const grilprofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyprofilePic : grilprofilePic
                })
                
                await newUser.save()
                await context.login(newUser)
                return newUser

                
            } catch (err) {
                console.log("Error in signUp: ", err);
                throw new Error(err.message || "Internal server error");
                
            }
        },

        login: async (_, {input}, context) =>{
            try {
                const {username, password} = input;
                if(!username || !password) throw new Error("All fields are required")
                const {user} = await context.authenticate("graphql-local", {username, password})

                await context.login(user)

                return user
            } catch (err) {
                console.error("Error in login:", err);
                throw new Error(err.message || "internal server error")
                
            }
        },
        logout: async (_parent, _args, context)=>{
            try {
                await context.logout()
                context.req.session.destroy((err)=>{
                    if (err) throw new Error(err.message)
                })
                context.res.clearCookies("connect.sid")
                return {message: "Log out successfully"}

            } catch (err) {
                console.error("Error in logout:", err);
                throw new Error(err.message || "internal server error")
            }
        }
    }


}

export default userResolver