import { processStaticQueries } from "../query"
import reporter from "gatsby-cli/lib/reporter"
import { IQueryRunningContext } from "../state-machines/query-running/types"
import { assertStore } from "../utils/assert-store"

export async function runStaticQueries({
  parentSpan,
  queryIds,
  store,
  program,
  graphqlRunner,
}: Partial<IQueryRunningContext>): Promise<void> {
  assertStore(store)

  if (!queryIds) {
    return
  }
  const { staticQueryIds } = queryIds
  if (!staticQueryIds.length) {
    return
  }

  const state = store.getState()
  const showActivity =
    process.env.GATSBY_PARALLEL_PAGE_GENERATION_ENABLED === `1` ||
    process.env.GATSBY_PARALLEL_PAGE_GENERATION_ENABLED === `true` ||
    !process.env.GATSBY_EXPERIMENTAL_PARALLEL_QUERY_RUNNING

  let activity
  if (showActivity) {
    activity = reporter.createProgress(
      `run static queries`,
      staticQueryIds.length,
      0,
      {
        id: `static-query-running`,
        parentSpan,
      }
    )
  }

  // TODO: This is hacky, remove with a refactor of PQR itself
  if (activity) {
    activity.start()
  }

  await processStaticQueries(staticQueryIds, {
    state,
    activity,
    graphqlRunner,
    graphqlTracing: program?.graphqlTracing,
  })

  if (activity) {
    activity.done()
  }
}
