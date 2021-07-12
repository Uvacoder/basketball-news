import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getNews from "app/news/queries/getNews"

const ITEMS_PER_PAGE = 100

export const NewsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ news, hasMore }] = usePaginatedQuery(getNews, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {news.map((news) => (
          <li key={news.id}>
            <Link href={Routes.ShowNewsPage({ newsId: news.id })}>
              <a>{news.title}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const NewsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>News</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewNewsPage()}>
            <a>Create News</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <NewsList />
        </Suspense>
      </div>
    </>
  )
}

NewsPage.authenticate = true
NewsPage.getLayout = (page) => <Layout>{page}</Layout>

export default NewsPage
