import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateNews = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateNews), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const news = await db.news.create({ data: input })

  return news
})
