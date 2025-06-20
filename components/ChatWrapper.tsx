"use client"

import { useChat } from "@ai-sdk/react";

export const ChatWrapper = ({sessionId}: {sessionId: string}) => {
    const { messages, handleInputChange, handleSubmit, input } = useChat({
        api: "/api/chat-stream",
        body: { sessionId},
    })

    return (
        <div className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 
        flex-col justify-between gap-2">
            <div className="fles-1 text-black bg-zinc-800 justify-between flex flex-col">
                {JSON.stringify(messages)}
            </div>
            <form onSubmit={handleSubmit}>
                <input value={input} onChange={handleInputChange} 
                type="text" />
            </form>
        </div>
    )
}