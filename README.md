A demo is running in http://44.199.23.199:3007/

## Deployment
### Frontend
install dependencies:

```bash
npm install
```

start it with:

```bash
npm run dev
```

front end will be running in <http://localhost:3000>

### Backend
install the dependencies:

```bash
pip install -r requirements.txt
```

add your openAI api key
```python
    def __init__(self):
        self.client = OpenAI(api_key='Your key')
        # self.assistant_id = ''  
```

start it with:
```bash
flask --app server run
```


![image](https://github.com/TheSaltiestFish/Awesome_GPT/assets/67789306/0e4c5ba1-1d25-4c94-956b-5cbab884f453)


## Development
+ Developed frontend with React.js and Next.js
+ Developed backend with Python and Flask, store user message in Redis, identify user by IP address
+ There are limitations like when chat history and files grows, may exceed openAI token limit.

## Bonus feature
+ Deployed on AWS EC2 instance, running on http://44.199.23.199:3007/
+ Can upload file through the upload button

