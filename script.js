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
const modalbg = document.querySelector('#modal_bg')
const deleteCardsModal = document.querySelector('#delete_cards_modal')
const closeModalBtns = document.querySelectorAll('.modal_close_btn')
const dont_remind_checkbox = document.querySelector('dont_remind_toggle')
const confirmDeleteBtn = document.querySelector('#confirm_delete_btn')
const smallModal = document.querySelector('#small_modal')
const smallModalText = document.querySelector('#small_modal p')
const smallModalHeader = document.querySelector('#small_modal h4')

var cardStorage = [];
var userScore = 0
var isMainGameDone = false
var timer
var dontRemind = false;
var modalID = 0


document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem('storedCard')) {
        cardStorage = JSON.parse(localStorage.getItem('storedCard'))
        cardStorage.forEach(addCard)
    }
})

window.addEventListener("load", ()=> {
    const loadingContainer = document.querySelector('#loading_container')
    const siteContent = document.querySelector('#site_content')
    loadingContainer.classList.remove('d-flex')
    siteContent.style.display = 'block'
})

deleteAllCardsBtn.addEventListener('click', () => {
    modalID = 1
    if (!dontRemind) {
        displayModal(deleteCardsModal)
        
    }
    else {
        deleteAllCards()
    }
})

modalbg.addEventListener('click', switchModals)

confirmDeleteBtn.addEventListener('click', () => {
    deleteAllCards()
    if (document.querySelector('#dont_remind_cb').checked) {
        dontRemind = true
    }
    displayModal(deleteCardsModal)
})
closeModalBtns.forEach((button) => {
    button.addEventListener('click', switchModals)
})

newCardBtn.addEventListener('click', () => {
    cardMaker.style.display == "none" ? cardMaker.style.display = "block" : cardMaker.style.display = "none"
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

function deleteAllCards() {
    cardContainer.innerHTML = ""
    cardStorage = []
    localStorage.clear()
}

function displayModal(modal) {
    if (modal.style.display == 'none') {
        modalbg.style.display = 'block'
        modal.style.display = 'block' 
    }
    else if (modal.style.display == 'block') {
        modalbg.style.display = 'none'
        modal.style.display = 'none'
    }
}

function switchModals() {
    switch(modalID) {
        case 1:
            displayModal(deleteCardsModal)
            break;
        case 2:
            displayModal(smallModal)
    }
}

function createInput() {
    if (!questionInput.value.trim() || !answerInput.value.trim()) {
        modalID = 2
        smallModalText.textContent = "please enter a valid input to the Question and Answer fields."
        smallModalHeader.textContent = "Unable to create card"
        displayModal(smallModal)
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


playBtn.addEventListener('click', () => {
    if (cardStorage.length != 0) {
        playCard()
    }
    else {
        modalID = 2
        smallModalText.textContent = "There are no existing cards. Create  a card to play."
        smallModalHeader.textContent = "No cards found"
        displayModal(smallModal)
    }
    
    
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
    const displayInstructionTimer = document.querySelector('#instruction_timer')
    instructionContainer.classList.add('d-flex')
    flashcardQuiz.classList.add('d-flex')
    flashcardQuiz.classList.remove('d-none')
    displayToggle(true)
    isMainGameDone = false
    var isReplay = false
    
    const displayInstruction = new Promise((resolve) => {
            let count = 3
            let instructionTimer = setInterval(() => {
                displayInstructionTimer.textContent = count
                count--
                if (count == -1) {
                    clearInterval(instructionTimer)
                    displayInstructionTimer.textContent = 3
                    isReplay = false
                    resolve()
                }
            }, 1000)
    }) 

    await displayInstruction

    instructionContainer.classList.remove('d-flex')
    playSection.style.display = "block"

    var seconds = 0, minutes = 0, hours = 0;
    const displayTimer = document.querySelector('#timer')
    var timer = setInterval(() => {
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
        displayScore.textContent = userScore + " / " + cardStorage.length
        scoreCard.style.display = "block"
        stopBtn.textContent = "replay"
        isReplay = true
        stopTimer()
    }
    

    stopBtn.addEventListener('click', () => {
        stopTimer()
        if (isReplay) {
            isReplayExit()
            playCard()
        }
        else {
            stopBtn.textContent = "replay"
            isMainGameDone = true
            isReplay = true
        }
    })

    function zeroPadding(number) {
        if (number < 10) {
            number = "0" + number
        }
        return number
    }
    

    function stopTimer() {
        clearInterval(timer)
        clearInterval(itemInterval)
    }

    exitBtn.addEventListener('click', () => {
        displayToggle(false)
        stopTimer()
        isReplayExit()
        cardSection.scrollIntoView()
    })

    function isReplayExit() {
        stopBtn.textContent = "stop"
        scoreCard.style.display = "none"
        isReplay = false
        instructionContainer.classList.remove('d-flex')
        displayTimer.textContent = zeroPadding(0) + ":" + zeroPadding(0) + ":" + zeroPadding(0)
    }

    
}
var itemInterval

async function mainGame() {
    const displayCardQuestion = document.querySelector('#card_question')
    var userInput = document.querySelector('#input_answer')
    var nextBtn = document.querySelector('#next_btn')
    var cardIndexArray = randomNumGenerator()
    var count = 0
    userScore = 0
    var skip = true
    var cardIndex


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




