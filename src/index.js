const emojiDisplay = document.querySelector('#emoji');
const englishWord = document.querySelector('#english-word');
const languageWordPrimary = document.querySelector('#language-word-primary');
const languageWordSecondary = document.querySelector('#language-word-secondary');
const percentage = document.querySelector('#percentage');
const nextButton = document.querySelector('#next');
const progressSection = document.querySelector('.progress-section');
let progressSectionText = Array.from(document.querySelectorAll('.progress-text'));
const audioIcon = document.querySelector('#audio-icon');

//Speech
const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();
msg.volume = 1;
msg.rate = 1;
msg.pitch = 1;
let voices = [];

const englishEmojiMapping =
  {
    "😀": 'Happy',
    "😄": "Laugh",
    "😉": "Wink",
    "😋": "Tasty",
    "😠": "Angry",
    "🤒": "Sick"
  };

const frenchEmojiMapping =
  {
    "😀": 'Content',
    "😄": "Rire",
    "😉": "Le clignement",
    "😋": "Savoureux",
    "😠": "En colère",
    "🤒": "Malade"
  };

let englishEmojiMappingUncompleted = Object.assign({}, englishEmojiMapping);
let frenchEmojiMappingUncompleted = Object.assign({}, frenchEmojiMapping);
let englishEmojiMappingCompleted = {};
let frenchEmojiMappingCompleted = {};

function updatePercentage() {
  const completed = Object.keys(frenchEmojiMapping).length - Object.keys(frenchEmojiMappingUncompleted).length;
  const objectLength = Object.keys(frenchEmojiMapping).length;
  percentage.innerText = `${completed}/${objectLength}`;
}

function populateVoices(e) {
  voices = speechSynthesis.getVoices();
  frenchVoices = voices.filter(voice => voice.lang.includes('fr'));
  const translator = frenchVoices.filter(voice => voice.name.includes("Thomas"));
  msg.voice = translator[0];
  msg.text = languageWordPrimary.innerText;
  speak();
}

function speak(startOver = true) {
    speechSynthesis.cancel();
    if (startOver) {
      synth.speak(msg)
    }
  }

function generateProgessSectionEmojis() {
  if (!Object.keys(englishEmojiMappingCompleted).length) return;
  return Object.keys(englishEmojiMappingCompleted)
    .map(
      (emoji) =>
        `<h1 class="progress-text">${emoji}</h1>`
    ).join('');
}
function generateProgessSectionUnanswered() {
  // console.log(progressSection.getElementsByTagName('*').length);
  // console.log(Object.keys(frenchEmojiMapping).length);
  if (!Object.keys(englishEmojiMappingUncompleted).length) return;
  return Object.keys(englishEmojiMappingUncompleted)
    .map(
      (emoji) =>
        `<h1 class="progress-text">🔣</h1>`
    ).join('');
}

function updateProgressSection() {
  if ((Object.keys(englishEmojiMappingCompleted).length) === (Object.keys(englishEmojiMapping).length)) {
    console.log('diff')
    htmlEmoji = generateProgessSectionEmojis();
    progressSection.innerHTML = htmlEmoji;
    return;
  }
  htmlEmoji = generateProgessSectionEmojis();
  htmlUnanswered = generateProgessSectionUnanswered();
  progressSection.innerHTML = htmlEmoji;
  progressSection.insertAdjacentHTML('beforeend', htmlUnanswered);
  // progressSectionText = document.querySelectorAll('.progress-text');
}

function updateUncompletedObject(randomeEmoji) {
  englishEmojiMappingCompleted[`${randomeEmoji}`] = englishEmojiMapping[`${randomeEmoji}`]
  frenchEmojiMappingCompleted[`${randomeEmoji}`] = frenchEmojiMapping[`${randomeEmoji}`]
  delete englishEmojiMappingUncompleted[`${randomeEmoji}`];
  delete frenchEmojiMappingUncompleted[`${randomeEmoji}`];
  updatePercentage();
  updateProgressSection();
}

function resetLanguageObjects() {
  englishEmojiMappingUncompleted = Object.assign({}, englishEmojiMapping);
  frenchEmojiMappingUncompleted = Object.assign({}, frenchEmojiMapping);
  englishEmojiMappingCompleted = {};
  frenchEmojiMappingCompleted = {};
  learnNewWord();
}

function addClassLists() {
  emojiDisplay.classList.add('new-text');
  englishWord.classList.add('new-text');
  languageWordPrimary.classList.add('new-text');
}

async function learnNewWord() {
  if (Object.keys(englishEmojiMappingUncompleted).length) {
    var english = Object.keys(englishEmojiMappingUncompleted)
  } else {
    resetLanguageObjects();
    return;
  }

  const randomeEmoji = english[Math.floor(Math.random() * english.length)]

  const englishVocab = englishEmojiMappingUncompleted[`${randomeEmoji}`];
  const frenchVocab = frenchEmojiMappingUncompleted[`${randomeEmoji}`];

  addClassLists();

  emojiDisplay.innerText = randomeEmoji;
  englishWord.innerText = englishVocab;
  languageWordPrimary.innerText = frenchVocab;

  updateUncompletedObject(randomeEmoji);
}

synth.addEventListener('voiceschanged', function() {
  var voices = synth.getVoices();
  frenchVoices = voices.filter(voice => voice.lang.includes('fr'));
  const translator = frenchVoices.filter(voice => voice.name.includes("Thomas"));
  msg.voice = translator[0];
  audioIcon.addEventListener('click', populateVoices);
});

// updatePercentage();
// learnNewWord();

document.addEventListener('DOMContentLoaded', updatePercentage);
document.addEventListener('DOMContentLoaded', learnNewWord);


// nextButton.addEventListener('click', learnNewWord);
emojiDisplay.addEventListener('animationend', () => {
  emojiDisplay.classList.remove('new-text');
  englishWord.classList.remove('new-text');
  languageWordPrimary.classList.remove('new-text')
});

function returnToPreviousEmoji() {
  console.log('here')
  console.log(e.target);
  console.log(e.currentTarget);
}

progressSectionText.forEach(emoji => {
  emoji.addEventListener('click', function() {
    console.log('here')
  });
})


if(document.readyState !== 'loading' ) {
    updatePercentage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        updatePercentage();
    });
}





