

document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;


    const keys = document.querySelectorAll('.keyboard-row button');

    function getNewWord() {
        fetch(
          `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5&?partOfSpeech=verb`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
              "x-rapidapi-key":
                "4296505ebdmsha712e8ae5205280p1ec80ejsn9fe1caaea77d",
            },
          }
        )

          .then((response) => {
              return response.json();
          })
          .then((res) => {
              word = res.word;
          })
          .catch((err) => {
              console.log(err);
          });
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord()
                return;
            }

            if (letter === 'del') {
                return;
            }
            
            updateGuessedWords(letter);

        };
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length 
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEL = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1;

            availableSpaceEL.textContent = letter;
        }
    }
    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition 

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }
        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");


        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {

                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`
            }, interval * index)
        });

        guessedWordCount += 1;


        if (currentWord === word) {
            window.alert("Congratulations")
        }
        if (guessedWords.length === 6) {
            window.alert(`Sorry you have no more guesses! The word is ${word}.`)
        }

        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 30; index ++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }



});