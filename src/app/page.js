'use client'

import { useInfiniteQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"

const serverData = [
  {id: 1, title: 'ana'},
  {id: 2, title: 'are'},
  {id: 3, title: 'mere'},
  {id: 4, title: 'si'},
  {id: 5, title: 'pere'},
  {id: 6, title: 'in'}
]

const fetchPost = async (page) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return serverData.slice((page - 1) * 2, page * 2)
}

// https://jsonplaceholder.typicode.com/posts?_page=31&_limit=20


// https://jsonplaceholder.typicode.com/posts?_limit=20&_page=31


const getServerData = async (page) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20&_page=31' + page)
  const characters = (await response.json())
  console.log()
  return characters;
}

const { ... } = useInfiniteQuery(['characters'], ({ pageParam = 1 }) => getCharacters(pageParam), {
getNextPageParam: (lastPage) => {
  const nextUrl = lastPage.info.next
  if (nextUrl) {
    // Return next page number
    return Number(nextUrl.charAt(nextUrl.length - 1))
  }
  // Return false means no next page
  return false
}
})

const queryClient = new QueryClient();


const MyComponent = ()=> {
  const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    ['query'], 
    async ({pageParam = 1}) => {
      const response = await fetchPost(pageParam)
      return response
    }, 
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      }
    }
  )
  return <>
    posts:
    {data?.pages.map((page, i)=> (
      <div key={i}>
        {page.map(p => <div key={p.id}>{p.title}</div>)}
      </div>
    ))}
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
