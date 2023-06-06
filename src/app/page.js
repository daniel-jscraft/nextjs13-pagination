'use client'

import { useInfiniteQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"

const getServerData = async (page) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20&_page=' + page)
  const characters = (await response.json())
  return characters;
}

const queryClient = new QueryClient();

const MyComponent = ()=> {
  const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    ['query'], 
    async ({pageParam = 1}) => {
      const response = await getServerData(pageParam)
      return response
    }, 
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      }
    }
  )
  return <>
    <h1>📖 Post list</h1>
    <ol>
      {data?.pages.map((page, i)=> (
        <span key={i}>
          {page.map(p => <li key={p.id}>{p.title}</li>)}
        </span>
      ))}
    </ol>
    <button 
      onClick={() => fetchNextPage()}
      disabled={isFetchingNextPage}>
        Load more
    </button>
  </>
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
        <MyComponent />
    </QueryClientProvider>
  )
}
