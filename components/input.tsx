import React, { useEffect, useRef, useState } from "react";
import { Conversation, ROLES } from "../pages";
import { toPng } from "html-to-image";
import download from "downloadjs";



interface Props {
  conversations: Conversation[];
  updateConversations: (conversations: Conversation[]) => void;
  updateErrMsg: (msg: string) => void;
  updateSavingStatus: (msg: boolean) => void;
}

export default function Input(props: Props) {
  const {
    updateErrMsg,
    updateConversations,
    conversations,
    updateSavingStatus,
  } = props;
  const [isMobile, setIsMobile] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [input, setInput] = useState("");
  const stop = useRef(false);
  const [saving, setSaving] = useState(false);
  let payload: Conversation[] = [];
  let storeMsg = "";

  async function handleSubmit() {
    stop.current = false;
    if (!input.trim()) {
      return;
    }
    updateErrMsg("");


    const currentQuestion = {
      role: ROLES.USER,
      text: input.trim(),
    };
    payload = [...conversations, currentQuestion];
    updateConversations(payload);
    fetchData(payload);
    setInput("");
  }

  function handleClear() {
    updateConversations([

    ]);
  }

  function handleStop() {
    stop.current = true;
    setSubmitLoading(false);
  }

  function fetchData(payload: Conversation[]) {
    setSubmitLoading(true);

    const body = {
      messsages: payload[payload.length-1],
    };
    fetch(`http://127.0.0.1:5000/sendtext`, {
      headers: {
        'Origin': 'https://http://127.0.0.1:5000',
        'Content-Type': 'application/json',
        
      },
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => {

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (!response.body) {
          throw new Error("There was no response body");
        }

        const decoder = new TextDecoder("utf-8");
        const reader = response?.body?.getReader();
        function read() {
          reader
            .read()
            .then(({ done, value }) => {
              if (stop.current) return;

              if (done) {
                setSubmitLoading(false);
                return;
              }
              const content = decoder.decode(value);

              if (content) {
                storeMsg += content;
                const curQuestion: Conversation = {
                  role: ROLES.ASSISTANT,
                  text: storeMsg.toString(),
                };
                updateConversations([...payload, curQuestion]);
              }
              read();
            })
            .catch((err) => {
              updateErrMsg(err.toString());
              setSubmitLoading(false);
            });
        }

        read();
      })
      .catch((err) => {
        updateErrMsg(err.toString());
        setSubmitLoading(false);
      });
  }

  function handleKeyDown(event: any) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();

      if (!submitLoading) {
        handleSubmit();
      }
    }
  }

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={`my-10 w-full max-w-5xl px-4 text-center sm:flex sm:items-center`}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={1}
        className="w-full rounded-md border-2 border-gray-300 p-3 shadow-sm focus:border-black focus:outline-0 dark:border-gray-700 dark:bg-slate-900 dark:focus:border-gray-600"
        placeholder={
          submitLoading
            ? "Waiting..."
            : `Ask me anything.${isMobile ? "" : " (cmd + enter to submit)"}`
        }
        onKeyDown={handleKeyDown}
      />
      <button
        className={`mt-3 h-10 w-40 rounded-md bg-black font-medium text-white hover:bg-slate-700 dark:bg-slate-300 dark:text-black dark:hover:bg-slate-400 sm:ml-3 sm:mt-0 sm:w-48 ${
          submitLoading ? "animate-pulse" : ""
        }`}
        onClick={handleSubmit}
        disabled={submitLoading}
      >
        {submitLoading ? "Waiting" : "Submit"}
      </button>
      <button
        className={`ml-3 mt-3 h-10 w-14 rounded-md border border-black font-medium text-black hover:bg-slate-100 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700 sm:mt-0 sm:w-28 ${
          submitLoading ? "animate-pulse" : ""
        }`}
        onClick={handleClear}
        disabled={submitLoading}
      >
        Clear
      </button>
      



      {/* The stop button is fixed to the header. */}
      {submitLoading ? (
        <button
          className={`fixed left-1/2 top-5 z-20 h-6 w-14 -translate-x-1/2 rounded border border-black font-normal text-black dark:border-white dark:text-white`}
          onClick={handleStop}
        >
          Stop
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
