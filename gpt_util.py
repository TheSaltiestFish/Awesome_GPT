import time
from openai import OpenAI
from openai.types.beta.thread import Thread
from typing_extensions import override
from openai import AssistantEventHandler

class GPTClient:
    instance = None
    client = None

    def __init__(self):
        self.client = OpenAI(api_key='')
        # self.assistant_id = ''  

    def __getClient(self):       
        return self.client

    @classmethod
    def getClient(cls):
        if GPTClient.instance is None:
            GPTClient.instance = GPTClient()
        return GPTClient.instance.__getClient()

# for openAI assistant, not used
def createThread() -> Thread:
    client = GPTClient.getClient()
    thread = client.beta.threads.create()
    return thread

def sendUserText(thread_id, history, text):
    client = GPTClient.getClient()

    history.append({"role": "user", "content": text})
    
    response = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=history
    )

    resp_text = response.choices[0].message.content
    history.append({"role": "system", "content": resp_text})
    return resp_text



