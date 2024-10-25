document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.innerText = 'Loading...';
    loadingIndicator.style.display = 'none';
    document.body.appendChild(loadingIndicator);

    // Handle animal image display based on selection
    document.querySelectorAll('input[name="animal"]').forEach(radio => {
        radio.addEventListener('change', async (event) => {
            const animal = event.target.value;
            loadingIndicator.style.display = 'block'; // Show loading indicator
            const response = await fetch(`/get_image_url?animal=${animal}`);
            const data = await response.json();
            loadingIndicator.style.display = 'none'; // Hide loading indicator
            if (data.url) {
                document.getElementById('animal-image').innerHTML = `<img src="${data.url}" alt="${animal}">`;
            } else {
                document.getElementById('animal-image').innerHTML = "Image not found";
            }
        });
    });

    // Handle file upload and display file info
    document.getElementById('file-input').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        loadingIndicator.style.display = 'block'; // Show loading indicator
        const response = await fetch('/upload_file', {
            method: 'POST',
            body: formData
        });

        loadingIndicator.style.display = 'none'; // Hide loading indicator
        const result = await response.json();
        if (result.name) {
            document.getElementById('file-info').innerHTML = `File Name: ${result.name}, Size: ${result.size} bytes, Type: ${result.type}`;
        } else {
            document.getElementById('file-info').innerHTML = "No file uploaded";
        }
    });

    // Fetch trivia question on page load
    fetchTriviaQuestion();

    async function fetchTriviaQuestion() {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple');
        const data = await response.json();
        loadingIndicator.style.display = 'none'; // Hide loading indicator

        if (data.results.length > 0) {
            const question = data.results[0].question;
            const answers = [...data.results[0].incorrect_answers, data.results[0].correct_answer];

            document.getElementById('trivia-question').innerHTML = question;
            const answersContainer = document.getElementById('trivia-answers');
            answersContainer.innerHTML = ''; // Clear previous answers

            answers.forEach(answer => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.innerText = answer;
                button.onclick = () => {
                    checkAnswer(answer, data.results[0].correct_answer);
                };
                answersContainer.appendChild(button);
            });
        } else {
            document.getElementById('trivia-question').innerHTML = "No trivia question available.";
        }
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            alert('Correct Answer!');
        } else {
            alert('Wrong Answer! The correct answer was: ' + correctAnswer);
        }
        fetchTriviaQuestion(); // Fetch a new question after answering
    }
});
