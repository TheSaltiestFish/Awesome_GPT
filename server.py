from flask import Flask
from flask import Flask, request, jsonify
from redis_util import RedisPool,getUserThread,setUserThread,getUserHistory,setUserHistory
from gpt_util import createThread, sendUserText
import json
from pdf_util import parse_pdf
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app, origins='http://localhost:3007')


@app.route("/")
def hello_world():    
    client_ip = request.remote_addr
    history = getUserHistory(client_ip)
    
    response = {'history': history}
    return jsonify(response)

@app.route('/sendtext', methods=['POST'])
def hello():
    
    json_data = request.get_json()
    print(json_data)
    text = json_data.get('messsages').get('text')
    if not text:
        return jsonify({'error': 'Missing parameter: text'}), 400
    
    client_ip = request.remote_addr

    user_history = getUserHistory(client_ip)
    print(user_history)
    if user_history is None:
        user_history = [{"role": "system", "content": "You are a helpful assistant."},]
    
    response = sendUserText(None, user_history, text)
    setUserHistory(client_ip, user_history)
    return jsonify(response)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    client_ip = request.remote_addr
    file_path = ''

    if 'file' not in request.files:
        return jsonify('Error : No file part'), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify('Error : No selected file'), 400

    if file:
        file_path = 'uploads/' + client_ip + '_' + time.time().__str__() + '_' + file.filename
        file.save(file_path)
    
    user_history = getUserHistory(client_ip)
    if user_history is None:
        user_history = [{"role": "system", "content": "You are a helpful assistant, user will upload information and ask you question about this file"},]
    
    parsed = parse_pdf(file_path)
    print(parsed)
    sendUserText(None, user_history, parsed)
    setUserHistory(client_ip, user_history)
    return jsonify(f'Upload {file.filename} successful, what do you want to know about this file?')



