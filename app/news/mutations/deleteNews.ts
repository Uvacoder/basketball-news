import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteNews = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteNews), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const news = await db.news.deleteMany({ where: { id } })

  return news
})
