import { createContext, useState } from "react";

export interface reply {
    content?: string,
    sender?: string
}

interface mreply extends reply{
    update?: (rep: reply) => any
}

export const CContext = createContext<mreply>({});

export const CCprovider = ({ children }: { children: JSX.Element }) => {
  const [reply, setReply] = useState<reply>({
        content: undefined,
        sender: undefined
  })

  return (
    <CContext.Provider
      value={{
        content: reply.content,
        sender: reply.sender,
        update: (rep: reply) => setReply(rep),
      }}
    >
      {children}
    </CContext.Provider>
  );
};
