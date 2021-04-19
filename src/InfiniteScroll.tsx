import React from "react"
import takeRight from "lodash.takeright"
import take from "lodash.take"
import { Box } from "grommet"
import "styled-components/macro"

type InfiniteScrollProps<D> = {
  items: D[]
  hasMore: boolean
  loadMore: () => Promise<void>
  renderFn: (item: D, i: number) => JSX.Element
}

export function InfiniteScroll<D>({ items, loadMore, renderFn, hasMore }: InfiniteScrollProps<D>) {
  const [element, setElement] = React.useState<HTMLElement | null>(null)
  const moreRef = React.useRef<boolean>(hasMore)
  const [done, setDone] = React.useState<boolean>(!hasMore)

  const prevY = React.useRef(0)
  const observer = React.useRef(
    new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        const y = firstEntry.boundingClientRect.y

        if (moreRef.current && prevY.current > y) {
          loadMore().then(() => {
            if (!hasMore) {
              setDone(true)
            }
          })
        }

        prevY.current = y
      },
      { threshold: 0 }
    )
  )

  React.useEffect(() => {
    const currentElement = element
    const currentObserver = observer.current

    if (currentElement) {
      currentObserver.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [element])

  let _tail = takeRight(items, 1)
  const head = take(items, items.length - 1)
  const [target, ...tail] = _tail

  if (items.length < 25) {
    console.log("les than 25")
    return (
      <>
        {items.map(renderFn)}
        <Box ref={setElement}></Box>
        {done && <Box>DONE!</Box>}
      </>
    )
  } else {
    return (
      <>
        {head.map(renderFn)}
        <Box
          width="100%"
          height="100%"
          css={`
            > div {
              height: 100%;
              width: 100%;
            }
          `}
          ref={setElement}
        >
          {renderFn(target, items.length - 6)}
        </Box>
        {tail.map(renderFn)}
      </>
    )
  }
}
