import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
    query GetTransactions{
        transactions{
            _id
            description
            paymentType
            category
            amount
            location
            data
        }
    }
`

export const GET_TRANSACTION = gql`
    query GetTransactions($id: ID!){
        transactions(transactionsId: $id){
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`