import { request, GraphQLClient } from 'graphql-request'
import { useQuery } from 'react-query'
import { News } from '../types/types'
import { GET_NEWS } from '../queries/queries'

interface NewsRes {
  news: News[]
}

const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT
const ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
const client = new GraphQLClient(endpoint, {headers: {
  "x-hasura-admin-secret": ADMIN_SECRET
}})

export const fetchNews = async () => {
  const { news: data } = await client.request<NewsRes>(
    // process.env.NEXT_PUBLIC_HASURA_ENDPOINT,
    GET_NEWS
  )
  return data
}

export const useQueryNews = () => {
  return useQuery<News[], Error>({
    queryKey: 'news',
    queryFn: fetchNews,
    staleTime: Infinity,
  })
}

