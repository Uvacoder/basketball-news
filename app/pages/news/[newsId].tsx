import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getNews from "app/news/queries/getNews"
import deleteNews from "app/news/mutations/deleteNews"

export const News = () => {
  const router = useRouter()
  const newsId = useParam("newsId", "number")
  const [deleteNewsMutation] = useMutation(deleteNews)
  const [news] = useQuery(getNews, { id: newsId })

  return (
    <>
      <Head>
        <title>News {news.id}</title>
      </Head>

      <div>
        <h1>News {news.id}</h1>
        <pre>{JSON.stringify(news, null, 2)}</pre>

        <Link href={Routes.EditNewsPage({ newsId: news.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteNewsMutation({ id: news.id })
              router.push(Routes.NewsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowNewsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.NewsPage()}>
          <a>News</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <News />
      </Suspense>
    </div>
  )
}

ShowNewsPage.authenticate = true
ShowNewsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowNewsPage
