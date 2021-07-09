import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getNews from "app/news/queries/getNews"
import updateNews from "app/news/mutations/updateNews"
import { NewsForm, FORM_ERROR } from "app/news/components/NewsForm"

export const EditNews = () => {
  const router = useRouter()
  const newsId = useParam("newsId", "number")
  const [news, { setQueryData }] = useQuery(
    getNews,
    { id: newsId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateNewsMutation] = useMutation(updateNews)

  return (
    <>
      <Head>
        <title>Edit News {news.id}</title>
      </Head>

      <div>
        <h1>Edit News {news.id}</h1>
        <pre>{JSON.stringify(news)}</pre>

        <NewsForm
          submitText="Update News"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateNews}
          initialValues={news}
          onSubmit={async (values) => {
            try {
              const updated = await updateNewsMutation({
                id: news.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowNewsPage({ newsId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditNewsPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditNews />
      </Suspense>

      <p>
        <Link href={Routes.NewsPage()}>
          <a>News</a>
        </Link>
      </p>
    </div>
  )
}

EditNewsPage.authenticate = true
EditNewsPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditNewsPage
