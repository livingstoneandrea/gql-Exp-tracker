
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
    Query: {
        transactions: async (_,__, context)=>{
            try {
                if (!context.getUser()) throw new Error("Unauthorized");

                const userId = context.getUser()._id;

                const transactions = await Transaction.find({userId})

                return transactions


            } catch (err) {
                console.error("Error getting transactions: ", err);
                throw new Error("Error getting transactions")
                
            }
        },
        transaction: async (_, {transactionId})=>{
            try {
                
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (err) {
                console.error("Error getting transaction: ", err);
                throw new Error("Error getting transaction")
            }
        },
        categoryStatistics: async (_parent, _args, context)=>{
            console.log(context.getUser()._id)
            if (!context.getUser()) throw new Error("Unauthorized");


            const userId = context.getUser()._id
            const transactions = await Transaction.find({userId});

            const categoryMap = {}

            transactions.forEach((transaction)=> {
                if (!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0
                }
                categoryMap[transaction.category] += transaction.amount
            })
    
            return Object.entries(categoryMap).map(([category, totalAmount])=>({category, totalAmount}))

        }

    },
    Mutation: {
        createTransaction: async (_parent, {input}, context)=>{
            
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })
                await newTransaction.save()
                return newTransaction
            } catch (err) {
                console.error("Error creating transaction: ", err);
                throw new Error("Error creating transaction")
            }
        },
        updateTransaction: async (_parent, {input})=>{
             
            try {
                const updateTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input, {new: true})

                return updateTransaction
            } catch (err) {
                console.error("Error updating transaction: ", err);
                throw new Error("Error updating transaction")
            }
        },
        deleteTransaction: async (_parent, {transactionId})=>{
            try {
                const deleteTransaction = await Transaction.findByIdAndDelete(transactionId)

                return deleteTransaction
            } catch (err) {
                console.error("Error deleting transaction: ", err);
                throw new Error("Error deleting transaction")
            }
        },

    },

    Transaction:{
        user: async(parent)=>{
            const userId = parent.userId
            try {
                const user = await User.findById(userId)
                return user;
            } catch (err) {
                console.error("Error getting user:", err);
                throw new Error("Error getting user")
            }
        }
    }


}

export default transactionResolver