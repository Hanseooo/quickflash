const newCardBtn = document.querySelector('#new_card_btn')
const closeCardMakerBtn = document.querySelector('#card_maker_close')
const cardMaker = document.querySelector('#card_maker')
const cardContainer = document.querySelector('.flashcard_container')
const addCardBtn = document.querySelector('#add_card_btn')
const deleteAllCardsBtn = document.querySelector('#del_card_btn')
const questionInput = document.querySelector('#question_input')
const answerInput = document.querySelector('#answer_input')
const flashcards = document.querySelectorAll('.flashcard')
const playBtn = document.querySelector('#play_card_btn')
const stopBtn = document.querySelector('#stop_btn')
const exitBtn = document.querySelector('#exit_btn')
const aboutSection = document.querySelector('#about')
const cardSection = document.querySelector('#cards')
const homeSection = document.querySelector('#home')
const playSection = document.querySelector('#play_cards')
const instructionContainer = document.querySelector('#instructions_container')
const flashcardQuiz = document.querySelector('#flashcard_quiz')
const displayScore = document.querySelector('#display_score')
const scoreCard = document.querySelector('#score_card')

var cardStorage = [];
var userScore = 0
var isMainGameDone = false
var timer


document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem('storedCard')) {
        cardStorage = JSON.parse(localStorage.getItem('storedCard'))
        cardStorage.forEach(addCard)
    }
})





newCardBtn.addEventListener('click', () => {
    cardMaker.style.display = "block"
})

closeCardMakerBtn.addEventListener('click', () => {
    cardMaker.style.display = "none"
})

addCardBtn.addEventListener('click', createInput)
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        createInput()
    }
})

function createInput() {
    if (questionInput.value == "" || answerInput == "") {
    }
    else {
        saveInputs()
        questionInput.value = ""
        answerInput.value = "" 
    }
}

function saveInputs() {
    var inputs = {
        'question' : questionInput.value,
        'answer' : answerInput.value
    }
    cardStorage.push(inputs)
    localStorage.setItem('storedCard', JSON.stringify(cardStorage))
    addCard(cardStorage[cardStorage.length-1])
}

function addCard(card) {
    const newCard = document.createElement('div');
    newCard.classList.add("flashcard", "p-2", "rounded-4", "d-flex", "flex-column", "justify-content-between", "mx-1")
    const cardBody = document.createElement('div')
    const divider = document.createElement('div')
    divider.classList.add("border-bottom", "divider", "border-dark")
    const displayQuestion = document.createElement('p')
    const displayAnswer = document.createElement('h3');
    displayAnswer.textContent = card.answer
    displayQuestion.textContent = card.question
    displayAnswer.setAttribute("style", "visibility: hidden;")
    displayAnswer.classList.add("mb-4", "text-center", "answer")
    newCard.appendChild(cardBody)
    cardBody.appendChild(divider)
    cardBody.appendChild(displayQuestion)
    newCard.appendChild(displayAnswer)
    cardContainer.appendChild(newCard)
    newCard.addEventListener('click', () => {
        if (displayAnswer.style.visibility == "hidden") {
            displayAnswer.style.visibility = "visible" 

        }
        else  {
            displayAnswer.style.visibility = "hidden"

        }
        
    })
}
deleteAllCardsBtn.addEventListener('click', () => {
    cardContainer.innerHTML = ""
    cardStorage = []
    localStorage.clear()
})
flashcards.forEach(card => {
    card.addEventListener('click', flipToggler)
})
function flipToggler() {
    this.classList.toggle('flip')
}

playBtn.addEventListener('click', () => {

    
    playCard()
    
})



function displayToggle(isPlay) {
    if (isPlay) {
        homeSection.style.display = "none"
        aboutSection.style.display = "none"
        cardSection.style.display = "none"
        playSection.style.display = "none"
    }
    else {
        
        homeSection.style.display = "block"
        aboutSection.style.display = "block"
        cardSection.style.display = "block"
        playSection.style.display = "none"
        scoreCard.style.display = "none"
        instructionContainer.classList.remove('d-flex')
    }
}

async function playCard() {
    const quizContainer = document.querySelector('#quiz_container')
    const instructionTimer = document.querySelector('#instruction_timer')
    instructionContainer.classList.add('d-flex')
    flashcardQuiz.classList.add('d-flex')
    flashcardQuiz.classList.remove('d-none')
    displayToggle(true)
    isMainGameDone = false
    
    const displayInstruction = new Promise((resolve) => {
            let count = 3
            let timer = setInterval(() => {
                instructionTimer.textContent = count
                count--
                if (count == -1) {
                    clearInterval(timer)
                    instructionTimer.textContent = 3
                    resolve()
                }
            }, 1000)
    }) 

    const playStart = await displayInstruction

    instructionContainer.classList.remove('d-flex')
    playSection.style.display = "block"

    var seconds = 0, minutes = 0, hours = 0;
    const displayTimer = document.querySelector('#timer')
    timer = setInterval(() => {
        seconds++
        if (seconds == 60) {
            minutes++
            seconds = 0
        }
        if (minutes == 60) {
            hours++
            minutes = 0
        } 


        displayTimer.textContent = zeroPadding(hours) + ":" + zeroPadding(minutes) + ":" + zeroPadding(seconds)
    }, 1000)

    var mainGameStart = new Promise((resolve) => {
        mainGame().then(() => resolve())
    })
    
    await mainGameStart

    if (isMainGameDone) {
        clearInterval(timer)
    }
    displayScore.textContent = userScore + " / " + cardStorage.length
    scoreCard.style.display = "block"
    

    function zeroPadding(number) {
        if (number < 10) {
            number = "0" + number
        }
        return number
    }
    stopBtn.addEventListener('click', stopTimer)

    function stopTimer() {
        clearInterval(timer)
    }

    exitBtn.addEventListener('click', () => {
        displayToggle(false)
        stopTimer()
        displayTimer.textContent = zeroPadding(0) + ":" + zeroPadding(0) + ":" + zeroPadding(0)
        cardSection.scrollIntoView()
    })

    

    
}

async function mainGame() {
    const displayCardQuestion = document.querySelector('#card_question')
    var userInput = document.querySelector('#input_answer')
    var nextBtn = document.querySelector('#next_btn')
    var cardIndexArray = randomNumGenerator()
    var count = 0
    userScore = 0
    var skip = true
    var itemInterval, cardIndex


    console.log(cardStorage)
    console.log(cardIndexArray)

    

    

    const cardContent = new Promise((resolve) => {
        
        function quizGame() {
            if (count >= cardIndexArray.length) {
                clearInterval(itemInterval)
                console.log("cleared and resolved")
                resolve()
                return
            }
            cardIndex = cardIndexArray[count]
            displayCardQuestion.textContent = cardStorage[cardIndex].question
            userInput.value = ""
        
            console.log(cardStorage[cardIndex])
            console.log(cardStorage[cardIndex].question)
            nextBtn.replaceWith(nextBtn.cloneNode(true))
            userInput.replaceWith(userInput.cloneNode(true))
            nextBtn = document.querySelector('#next_btn')
            userInput = document.querySelector('#input_answer')
            count++
            userInput.focus()

            

            nextBtn.addEventListener('click', () => {
                nextFlashCard(quizGame, cardIndex)
                return
            })
            userInput.addEventListener('keydown', (event) => {
                if (event.key == 'Enter') {
                    nextFlashCard(quizGame, cardIndex)
                    return
                }
            } )
            stopBtn.addEventListener('click', () => {
                nextFlashCard(quizGame, cardIndex)
                clearInterval(itemInterval)
                resolve()
                return
            })
            
            
        }

        quizGame()
        itemInterval = setInterval(quizGame, 7000)
    })

    await cardContent

    flashcardQuiz.classList.remove('d-flex')
    flashcardQuiz.classList.add('d-none')
    isMainGameDone = true
    console.log(userScore)

    function submitAnswer(cardIndex) {
        var correctAnswer = cardStorage[cardIndex].answer.toLowerCase()
        var userAnswer = userInput.value.toLowerCase()
        if (userAnswer === correctAnswer) {
            userScore++
        }

    }

    function nextFlashCard(callback, cardIndex) {
        clearInterval(itemInterval);
        itemInterval = setInterval(callback, 7000);
        submitAnswer(cardIndex)
        console.log("clicked " + userScore)
        callback()
        userInput.focus()
    }

    function randomNumGenerator() {
        var randomNum, count = 0, randomNumArray = []

        do {
            randomNum = Math.floor(Math.random() * cardStorage.length)
            if (randomNumArray.length == 0) {
                randomNumArray.push(randomNum)
                count++
            }
            else {
                if (!randomNumArray.includes(randomNum)) {
                    randomNumArray.push(randomNum)
                    count++
                }

            } 
        } while(count != cardStorage.length)

        return randomNumArray
    
    }

}




