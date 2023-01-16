import { router } from '@trpc/server'
import { Context } from './createContext'
import superjson from 'superjson'

export const createRouter = () => {
    return router<Context>().transformer(superjson)
}