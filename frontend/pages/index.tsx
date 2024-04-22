import type from "next";
import { useEffect, useState } from "react";

import Chat from "../components/chat";
import Input from "../components/input";
import { useRouter } from "next/router";
import React from 'react';
import UploadComponent from '../components/upload'; 

export type ROLE_TYPE = "user" | "assistant" | "system";
export interface Conversation {
  role: ROLE_TYPE;
  text: string;
}

export enum ROLES {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}


export default function Home() {
  const [errMsg, setErrMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      role: ROLES.SYSTEM,
      text: "You are a helpful assistant. Answer in detail.",
    },
  ]);
  const router = useRouter();



  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-16 flex w-full flex-1 flex-col items-center text-center">
        <Chat conversations={conversations} saving={saving} />
        {errMsg ? (
          <div className="mt-6 w-full font-bold text-red-500">{errMsg}</div>
        ) : (
          ""
        )}
      </div>

      <Input
        conversations={conversations}
        updateConversations={setConversations}
        updateErrMsg={setErrMsg}
        updateSavingStatus={setSaving}
      />
      <UploadComponent />
    </div>
  );
}





