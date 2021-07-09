import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateNews = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateNews),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const news = await db.news.update({ where: { id }, data })

    return news
  }
)
