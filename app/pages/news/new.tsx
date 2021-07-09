import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createNews from "app/news/mutations/createNews"
import { NewsForm, FORM_ERROR } from "app/news/components/NewsForm"

const NewNewsPage: BlitzPage = () => {
  const router = useRouter()
  const [createNewsMutation] = useMutation(createNews)

  return (
    <div>
      <h1>Create New News</h1>

      <NewsForm
        submitText="Create News"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateNews}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const news = await createNewsMutation(values)
            router.push(Routes.ShowNewsPage({ newsId: news.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.NewsPage()}>
          <a>News</a>
        </Link>
      </p>
    </div>
  )
}

NewNewsPage.authenticate = true
NewNewsPage.getLayout = (page) => <Layout title={"Create New News"}>{page}</Layout>

export default NewNewsPage
