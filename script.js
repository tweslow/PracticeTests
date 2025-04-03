// Example sets: You can add or remove entries depending on how many JSON files you have.
const sets = [
  { name: "Security+ Questions", file: "questions_securityplus.json" },
  { name: "Security+ Hard Questions", file: "SecurityPlusHard.json" },
  { name: "Security+ Section 1 Questions", file: "SecurityPlusSectionOne.json" },
  { name: "Security+ Section 2 Questions", file: "SecurityPlusSectionTwo.json" },
  { name: "Security+ Section 3 Questions", file: "SecurityPlusSectionThree.json" },
  { name: "Security+ Section 4 Questions", file: "SecurityPlusSectionFour.json" },
  { name: "Security+ Section 5 Questions", file: "SecurityPlusSectionFive.json" },
  // { name: "Other Set", file: "questions_other.json" },
];

let questions = [];
let currentIndex = 0;
//score counters
let correctCount = 0;
let attemptedCount = 0;


window.addEventListener('DOMContentLoaded', () => {
  const setSelect = document.getElementById('setSelect');
  const questionText = document.getElementById('questionText');
  const choicesList = document.getElementById('choicesList');
  const checkBtn = document.getElementById('checkBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Populate the dropdown with available question sets
  sets.forEach(s => {
    const option = document.createElement('option');
    option.value = s.file;
    option.textContent = s.name;
    setSelect.appendChild(option);
  });

  // Load the first set by default
  loadQuestions(sets[0].file);

  // If user selects a different set from the dropdown
  setSelect.addEventListener('change', () => {
    loadQuestions(setSelect.value);
  });

  // Check Answer button
  checkBtn.addEventListener('click', () => {
    checkAnswer();
  });

  // Previous button
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + questions.length) % questions.length;
    displayQuestion();
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % questions.length;
    displayQuestion();
  });
});

/**
 * Fetches the JSON file and loads the question array.
 */
function loadQuestions(file) {
  fetch(file)
    .then(response => response.json())
    .then(data => {
      questions = data;
      currentIndex = 0;
      correctCount = 0;
      attemptedCount = 0;
      displayQuestion();
    })
    .catch(error => {
      console.error("Error loading questions:", error);
      document.getElementById('questionText').textContent = "Failed to load questions.";
      document.getElementById('choicesList').innerHTML = "";
    });
}

/**
 * Displays the current question and its choices in the UI.
 * Also clears any old feedback each time we show a new question.
 */
function displayQuestion() {
  const questionObj = questions[currentIndex];
  const questionText = document.getElementById('questionText');
  const choicesList = document.getElementById('choicesList');

  // Clear any old correct/incorrect labels
  clearFeedback();

  // If there's no questionObj (empty array?), handle gracefully
  if (!questionObj) {
    questionText.textContent = "No questions available.";
    choicesList.innerHTML = "";
    return;
  }

  // Show the question text (remove "Q#:" if you prefer)
  questionText.textContent = questionObj.question;

  // Populate the multiple-choice answers as radio buttons
  choicesList.innerHTML = "";
  questionObj.choices.forEach((choice, idx) => {
    const li = document.createElement('li');

    const label = document.createElement('label');
    label.style.cursor = "pointer";

    const radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "questionChoice";
    radio.value = idx;

    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + choice));

    li.appendChild(label);
    choicesList.appendChild(li);
  });
}

/**
 * Checks the selected radio button vs. the correct answerIndex.
 * Displays 'Correct!' or 'Incorrect!' next to the chosen option.
 */
function checkAnswer() {
  const questionObj = questions[currentIndex];
  const radios = document.getElementsByName('questionChoice');
  let selectedValue = null;

  // Check if already answered to avoid double counting
  if (questionObj.answered) {
    alert("You’ve already answered this question.");
    return;
  }

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      selectedValue = parseInt(radios[i].value, 10);
      break;
    }
  }

  if (selectedValue === null) {
    alert("Please select an answer first.");
    return;
  }

  clearFeedback();

  const chosenRadio = radios[selectedValue];
  const chosenLabel = chosenRadio.parentNode;

  if (selectedValue === questionObj.answerIndex) {
    chosenLabel.appendChild(createFeedbackSpan(" - Correct!", "correct-label"));
    correctCount++;
  } else {
    chosenLabel.appendChild(createFeedbackSpan(" - Incorrect!", "incorrect-label"));
    const correctRadio = radios[questionObj.answerIndex];
    const correctLabel = correctRadio.parentNode;
    correctLabel.appendChild(createFeedbackSpan(" - Correct!", "correct-label"));
  }

  // Mark as answered
  questionObj.answered = true;

  attemptedCount++;
  updateScore();
}

function updateScore() {
  document.getElementById('correctCount').textContent = correctCount;
  document.getElementById('attemptedCount').textContent = attemptedCount;
}


/**
 * Removes any existing 'Correct!' or 'Incorrect!' text from all radio labels.
 */
function clearFeedback() {
  const labels = document.querySelectorAll('#choicesList label');
  labels.forEach(label => {
    // Remove any spans with the correct-label or incorrect-label classes
    const spans = label.querySelectorAll('.correct-label, .incorrect-label');
    spans.forEach(span => span.remove());
  });
}

/**
 * Creates a small <span> element to display next to the chosen answer,
 * e.g. " - Correct!" or " - Incorrect!" with custom CSS styling.
 */
function createFeedbackSpan(text, className) {
  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(className);
  return span;
}

