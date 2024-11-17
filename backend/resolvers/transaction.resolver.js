
import Transaction from "../models/transaction.model.js";

const transactionResolver = {
    Query: {
        transactions: async (context)=>{
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
        transaction: async (_, {transactionId},)=>{
            try {
                
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (err) {
                console.error("Error getting transaction: ", err);
                throw new Error("Error getting transaction")
            }
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
        updateTransaction: async (_parent, {input}, _context)=>{
             
            try {
                const updateTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input, {new: true})

                return updateTransaction
            } catch (err) {
                console.error("Error updating transaction: ", err);
                throw new Error("Error updating transaction")
            }
        },
        deleteTransaction: async (_parent, {transactionId}, _context)=>{
            try {
                const deleteTransaction = await Transaction.findByIdAndDelete(transactionId)

                return deleteTransaction
            } catch (err) {
                console.error("Error deleting transaction: ", err);
                throw new Error("Error deleting transaction")
            }
        },

    },
}

export default transactionResolver