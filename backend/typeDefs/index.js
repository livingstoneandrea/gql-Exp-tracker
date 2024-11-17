import {mergeResolvers} from '@graphql-tools/merge'

import userTypeDef from './user.typeDef.js'
import transactionTypeDef from './transaction.typeDef.js'


const typeDefs = [userTypeDef,].filter(Boolean)
// console.log(typeDefs)
const mergedTypeDefs = mergeResolvers(typeDefs)

export default mergedTypeDefs
