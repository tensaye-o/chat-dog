'use client'

import { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react'

import { sleep, randomize } from '@/lib/utils'
import { TextItem } from '@/types'

export const useChat = () => {
  const [input, setInput] = useState('')
  const [text, setText] = useState<TextItem[]>([])
  const [isDisabled, setIsDisabled] = useState(false)

  const onInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const process = useCallback(async () => {
    setText((prev) => [{ role: 'user', content: input }, ...prev])
    setInput('')
    setIsDisabled(true)
    await sleep(2000)
    setText((prev) => [
      { role: 'bot', content: '汪'.repeat(randomize()) },
      ...prev,
    ])
    setIsDisabled(false)
  }, [input])

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.metaKey && e.key === 'Enter' && input) {
        process()
      }
    },
    [input, process]
  )

  const onSubmit = useCallback(() => {
    if (input) {
      process()
    }
  }, [input, process])

  return { text, input, onInput, onEnter, isDisabled, onSubmit }
}
