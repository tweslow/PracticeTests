// Example sets (adjust as needed)
const sets = [
  { name: "Security+ Questions", file: "questions_securityplus.json" }
  // Add more sets if desired:
  // { name: "Other Course", file: "questions_other.json" }
];

let questions = [];
let currentIndex = 0;

window.addEventListener('DOMContentLoaded', () => {
  const setSelect = document.getElementById('setSelect');
  const questionText = document.getElementById('questionText');
  const choicesList = document.getElementById('choicesList');
  const checkBtn = document.getElementById('checkBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Populate dropdown with available question sets
  sets.forEach(s => {
    const option = document.createElement('option');
    option.value = s.file;
    option.textContent = s.name;
    setSelect.appendChild(option);
  });

  // By default, load the first set
  loadQuestions(sets[0].file);

  // If user changes the set
  setSelect.addEventListener('change', () => {
    loadQuestions(setSelect.value);
  });

  checkBtn.addEventListener('click', () => {
    checkAnswer();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + questions.length) % questions.length;
    displayQuestion();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % questions.length;
    displayQuestion();
  });
});

/**
 * Fetch and load the selected questions file (JSON).
 */
function loadQuestions(file) {
  fetch(file)
    .then(response => response.json())
    .then(data => {
      questions = data;
      currentIndex = 0;
      displayQuestion();
    })
    .catch(error => {
      console.error("Error loading questions:", error);
      document.getElementById('questionText').textContent = "Failed to load questions.";
      document.getElementById('choicesList').innerHTML = "";
    });
}

/**
 * Display the current question and its choices.
 */
function displayQuestion() {
  const questionObj = questions[currentIndex];
  const questionText = document.getElementById('questionText');
  const choicesList = document.getElementById('choicesList');

  if (!questionObj) {
    questionText.textContent = "No questions available.";
    choicesList.innerHTML = "";
    return;
  }

 questionText.textContent = questionObj.question;
  
  // Populate choices as radio buttons
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
 * Check which choice is selected and compare with the answer.
 */
function checkAnswer() {
  const questionObj = questions[currentIndex];
  const radios = document.getElementsByName('questionChoice');
  let selectedValue = null;

  for (let r of radios) {
    if (r.checked) {
      selectedValue = parseInt(r.value, 10);
      break;
    }
  }

  if (selectedValue === null) {
    alert("Please select an answer first.");
    return;
  }

  const correct = (selectedValue === questionObj.answerIndex);
  if (correct) {
    alert("Correct! " + (questionObj.explanation || ""));
  } else {
    alert("Incorrect.\n\n" + "Correct answer: " 
          + questionObj.choices[questionObj.answerIndex] 
          + "\n\n" + (questionObj.explanation || ""));
  }
}
