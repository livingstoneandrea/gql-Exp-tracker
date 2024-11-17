import {mergeResolvers} from '@graphql-tools/merge'

import userResolver from './user.resolver.js'
import transactionResolver from './transaction.resolver.js'


const resolvers = [userResolver, transactionResolver].filter(Boolean); // Removes undefined or null values
// console.log('Resolvers:', resolvers);

const mergedResolvers = mergeResolvers(resolvers)

export default mergedResolvers
