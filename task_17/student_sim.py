from flask import Flask, jsonify
import time

app = Flask(__name__)

students = [
    {"id": 1, "name": "John", "department": "AI"},
    {"id": 2, "name": "Alice", "department": "DS"}
]

@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students)

if __name__ == '__main__':
    print("Student Service (Simulated) running on port 8081...")
    app.run(port=8081)
