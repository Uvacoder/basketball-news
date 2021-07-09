import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetNewsInput
  extends Pick<Prisma.NewsFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetNewsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: news,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.news.count({ where }),
      query: (paginateArgs) => db.news.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      news,
      nextPage,
      hasMore,
      count,
    }
  }
)
