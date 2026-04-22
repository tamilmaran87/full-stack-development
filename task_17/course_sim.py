from flask import Flask, jsonify
import urllib.request
import json

app = Flask(__name__)

STUDENT_URL = "http://localhost:8081/students"

@app.route('/courses/students', methods=['GET'])
def fetch_students():
    try:
        with urllib.request.urlopen(STUDENT_URL, timeout=2) as response:
            data = json.loads(response.read().decode())
            return jsonify(data)
    except Exception as e:
        return "Fallback: Student Service Down! Error: " + str(e), 503

if __name__ == '__main__':
    print("Course Service (Simulated) running on port 8082...")
    app.run(port=8082)
