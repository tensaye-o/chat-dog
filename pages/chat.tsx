'use client'

import { User, Bone, Dog } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChat } from '@/hooks/use-chat'
import { cn } from '@/lib/utils'

const Chat = () => {
  const { text, input, onInput, onEnter, isDisabled, onSubmit } = useChat()

  return (
    <main className="flex flex-col items-center justify-between h-screen p-4 md:py-8 bg-[#232946] text-[#b8c1ec] overflow-hidden">
      <div
        className="bg-[#b8c1ec] w-full border-[#b8c1ec] max-w-sm border p-2 rounded-md font-bold text-[#232946] mb-4 flex items-center gap-2 justify-center h-16"
        key="header"
      >
        <Dog size={24} />
        {'Chat Dog'}
      </div>
      <div className="flex flex-col w-full h-full max-w-sm gap-4 overflow-scroll scroll-smooth">
        {text.map(({ role: r, content: c }, idx) => (
          <div
            key={c + idx}
            className={cn(
              'p-2 rounded-md text-sm flex items-center gap-2',
              r === 'user'
                ? 'border bg-[#121629] border-[#121629] text-[#fffffe]'
                : 'border bg-[#eebbc3] border-[#eebbc3] text-[#232946]'
            )}
          >
            <div className="flex flex-col items-start h-full">
              {r === 'user' ? <User size={20} /> : <Dog size={20} />}
            </div>
            <div>
              {c.split('\n').map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex items-center w-full max-w-sm mt-4 space-x-2">
        <Input
          className="whitespace-pre-wrap"
          type="text"
          placeholder="Build your context..."
          value={input}
          onChange={onInput}
          onKeyDown={onEnter}
        />
        <Button
          className="absolute z-10 shadow bottom-2 right-2"
          disabled={isDisabled}
          type="submit"
          onClick={onSubmit}
        >
          <Bone color="#232946" size={20} />
        </Button>
      </div>
    </main>
  )
}

export default Chat
