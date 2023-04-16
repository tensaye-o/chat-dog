'use client'

import { useReducer, useEffect } from 'react'

import { TextItem } from '@/types'
import { randomize, sleep } from '@/lib/utils'
import { db } from '@/store'

const states = {
  idle: 'idle',
  typing: 'typing',
  submitting: 'submitting',
  loading: 'loading',
  respond: 'respond',
} as const
type State = keyof typeof states

type ActionType =
  | { type: 'idle'; payload: TextItem[] }
  | { type: 'typing'; payload: string }
  | { type: 'submitting'; payload: TextItem }
  | { type: 'loading' }
  | { type: 'respond'; payload: TextItem }

interface Context {
  next: State
  input: string
  text: Array<TextItem>
  loading: boolean
}

const reducer = (state: Context, action: ActionType) => {
  switch (action.type) {
    case 'idle': {
      return {
        ...state,
        text: action.payload,
        next: states['typing'],
      }
    }
    case 'typing': {
      return {
        ...state,
        input: action.payload,
        next: states['submitting'],
      }
    }
    case 'submitting': {
      return {
        ...state,
        input: '',
        text: [action.payload, ...state.text],
        next: states['loading'],
      }
    }
    case 'loading': {
      return {
        ...state,
        loading: !state.loading,
        next: states['respond'],
      }
    }
    case 'respond': {
      return {
        ...state,
        text: [action.payload, ...state.text],
        loading: !state.loading,
        next: states['idle'],
      }
    }
    default:
      throw Error('Unknown action.')
  }
}
/*
state:
idle -> 

t -> set msg

s -> cls msg & push msg

l -> sleep(2s)

r -> push msg

data:
msg
msg arr
loader
*/

export const useChatFSM = () => {
  const [{ input, text, loading, next }, on] = useReducer(reducer, {
    next: states['idle'],
    input: '',
    text: [],
    loading: false,
  })

  useEffect(() => {
    const auto_run = async () => {
      const res = ((await db.read('context')) || []) as TextItem[]
      on({ type: 'idle', payload: res })
    }

    auto_run()
  }, [])

  useEffect(() => {
    const auto_run = async () => {
      if (next === 'loading') {
        on({ type: 'loading' })

        db.create('context', [{ role: 'user', content: input }, ...text])
      }

      if (next === 'respond') {
        await sleep(2000)

        const payload = {
          role: 'bot',
          content: 'ワン'.repeat(randomize()),
        } as TextItem
        db.create('context', [payload, ...text])

        on({
          type: 'respond',
          payload,
        })
      }
    }

    auto_run()
  }, [next])

  return {
    input,
    text,
    loading,
    on,
  }
}
