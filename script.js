// The quiz questions and answers
const quizQuestions = [
  {
    question: "Commonly used data types DO NOT include:",
    options: ["Strings", "Booleans", "Alerts", "Numbers"],
    correctAnswer: "Alerts",
  },
  {
    question: "The condition in an if / else statement is enclosed within ____.",
    options: ["Quotes", "Curly Brackets", "Parentheses", "Square Brackets"],
    correctAnswer: "Curly Brackets",
  },
  {
    question: "String values must be enclosed within _____ when being assigned to variables.",
    options: ["Commas", "Curly Brackets", "Quotes", "Parentheses"],
    correctAnswer: "Quotes",
  },
  {
    question: "Arrays in JavaScript can be used to store _____.",
    options: ["Numbers and Strings", "Other Arrays", "Booleans", "All of the above"],
    correctAnswer: "All of the above",
  },
  {
    question: "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: ["JavaScript", "Terminal/Bash", "For Loops", "console.log"],
    correctAnswer: "console.log",
  },
];

// Define variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60; // Initial time in seconds
let timerInterval;
let scoreSaved = false; // Variable to track whether the score has been saved

// Function to start the game
function startGame() {
  // Hide the start button
  document.getElementById("start-button").style.display = "none";

  // Start the timer
  startTimer();

  // Display the first question
  displayQuestion();
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0 || currentQuestionIndex >= quizQuestions.length) {
      clearInterval(timerInterval); // Clear the interval here
      updateTimerDisplay(); // Update timer display one last time
      endGame();
    }
  }, 1000);
}

// Function to display a question
function displayQuestion() {
  const questionContainer = document.getElementById("question-container");
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (currentQuestion) {
    // Display the question and answer choices
    questionContainer.innerHTML = `
      <h2>${currentQuestion.question}</h2>
      <ul>
        ${currentQuestion.options
          .map(
            (option) =>
              `<li><button onclick="checkAnswer('${option}')">${option}</button></li>`
          )
          .join("")}
      </ul>
    `;
  } else {
    // No more questions, end the game
    endGame();
  }
}

// Function to check the answer
function checkAnswer(selectedAnswer) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const messageContainer = document.getElementById("message-container");

  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++;
    messageContainer.textContent = "Correct! Good Job!";
  } else {
    messageContainer.textContent = "Wrong!";
    // Subtract time for incorrect answer
    timeLeft -= 10;
  }

  // Clear the message after a brief delay
  setTimeout(() => {
    messageContainer.textContent = "";
  }, 1000);

  currentQuestionIndex++;
  displayQuestion();
}

// Function to save the score
function saveScore() {
  if (!scoreSaved) {
    const initials = document.getElementById("initials").value;

    if (initials) {
      const scoreData = {
        initials: initials,
        score: score,
      };

      // Retrieve existing highscores from local storage or initialize an empty array
      const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

      // Add the current score to the highscores array
      highscores.push(scoreData);

      // Sort the highscores in descending order by score
      highscores.sort((a, b) => b.score - a.score);

      // Save the updated highscores back to local storage
      localStorage.setItem("highscores", JSON.stringify(highscores));

      // Display highscores
      displayHighscores();

      // Set the scoreSaved variable to true
      scoreSaved = true;
    } else {
      alert("Please enter your initials before saving the score.");
    }
  }
}

// Function to end the game
function endGame() {
  if (!scoreSaved) {
    // Calculate the score based on the time left
    score = timeLeft;

    // Hide the game container
    const gameContainer = document.getElementById("quiz-container");
    gameContainer.style.display = "none";

    // Display game over message and allow the user to save initials and score
    const gameOverContainer = document.createElement("div");
    gameOverContainer.innerHTML = `
      <h2>Game Over!</h2>
      <p>Your score: ${score}</p>
      <label for="initials">Enter your initials:</label>
      <input type="text" id="initials">
      <button id="save-score-button" class = "button" onclick="saveScore()">Save Score</button>
    `;

    // Append the game over container to the body
    document.body.appendChild(gameOverContainer);

    // Display highscores
    displayHighscores();

    // Set the scoreSaved variable to true
    scoreSaved = true;
  }
}

// Function to update the timer display
function updateTimerDisplay() {
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = `Time: ${timeLeft}`;
  }
}

// Function to display highscores
function displayHighscores() {
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

  // Sort the highscores in descending order by score
  highscores.sort((a, b) => b.score - a.score);

  // Display highscores in a list
  const highscoresList = document.getElementById("highscores-list");
  highscoresList.innerHTML = highscores
    .map((scoreData, index) => `<li>${index + 1}. ${scoreData.initials}: ${scoreData.score}</li>`)
    .join("");

  // Show the highscores container
  const highscoresContainer = document.getElementById("highscores-container");
  highscoresContainer.style.display = "block";

  // Add an event listener to the "Clear Highscores" button
  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", clearHighscores);
}

// Function to clear highscores
function clearHighscores() {
  localStorage.removeItem("highscores");
  const highscoresList = document.getElementById("highscores-list");
  highscoresList.innerHTML = ""; // Clear the highscores list on the page
}

// Add an event listener to start the game when the start button is clicked
document.getElementById("start-button").addEventListener("click", startGame);
