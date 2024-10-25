from flask import Flask, render_template, request, jsonify, url_for
import requests  # Add this import for making API requests

app = Flask(__name__)

# Serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint to return image URL based on animal selection
@app.route('/get_image_url')
def get_image_url():
    animal = request.args.get('animal')
    image_map = {
        "cat": "cat.jpg",
        "dog": "Dog.jfif",
        "elephant": "Elephant.jfif"
    }
    image_name = image_map.get(animal)
    if image_name:
        image_url = url_for('static', filename=f'images/{image_name}')
        return jsonify({'url': image_url})
    return jsonify({'error': 'Image not found'}), 404

# Endpoint to handle file upload and return file info
@app.route('/upload_file', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    if uploaded_file:
        uploaded_file.seek(0)  # Reset file pointer to the beginning
        file_info = {
            'name': uploaded_file.filename,
            'size': len(uploaded_file.read()),  # Get file size
            'type': uploaded_file.mimetype
        }
        return jsonify(file_info)
    return jsonify({'error': 'No file uploaded'}), 400

# Endpoint to get trivia questions
@app.route('/get_trivia')
def get_trivia():
    response = requests.get("https://opentdb.com/api.php?amount=1&type=multiple")
    data = response.json()
    if data['results']:
        question = data['results'][0]['question']
        correct_answer = data['results'][0]['correct_answer']
        incorrect_answers = data['results'][0]['incorrect_answers']
        all_answers = incorrect_answers + [correct_answer]
        return jsonify({'question': question, 'answers': all_answers, 'correct_answer': correct_answer})
    return jsonify({'error': 'Could not fetch trivia question'}), 500

if __name__ == '__main__':
    app.run(debug=True)
