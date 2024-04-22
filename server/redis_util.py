import redis
import json

class RedisPool:
    instance = None

    def __init__(self):
        self.pool = redis.ConnectionPool(host='localhost', port=6379, decode_responses=True, db=0)

    def __getConnection(self):
        conn = redis.Redis(connection_pool=self.pool)
        return conn

    @classmethod
    def getConn(cls):
        if RedisPool.instance is None:
            RedisPool.instance = RedisPool()
        return RedisPool.instance.__getConnection()

# Thread is for openAI assistant, not used
def getUserThread(client_ip) -> str:
    redisConn = RedisPool.getConn()
    thread_id = redisConn.get(client_ip)
    return thread_id
    
# Thread is for openAI assistant, not used
def setUserThread(client_ip, thread_id) -> bool:
    redisConn = RedisPool.getConn()
    ret = redisConn.set(client_ip, thread_id)
    return ret

def getUserHistory(client_ip) -> list:
    redisConn = RedisPool.getConn()
    history = redisConn.get(client_ip)
    if history is None:
        return []
    history = json.loads(history)
    return history

def setUserHistory(client_ip, history) -> bool:
    redisConn = RedisPool.getConn()
    print("before dumps")
    print(history)
    json_str = json.dumps(history)
    print(history)
    ret = redisConn.set(client_ip, json_str)
    return ret