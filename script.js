const newCardBtn = document.querySelector('#new_card_btn')
const closeCardMakerBtn = document.querySelector('#card_maker_close')
const cardMaker = document.querySelector('#card_maker')
const cardContainer = document.querySelector('.flashcard_container')
const addCardBtn = document.querySelector('#add_card_btn')
const deleteAllCardsBtn = document.querySelector('#del_card_btn')
const questionInput = document.querySelector('#question_input')
const answerInput = document.querySelector('#answer_input')
const flashcards = document.querySelectorAll('.flashcard')
const invalidInputModal = document.querySelector('#invalid_input_modal')
var cardStorage = [];


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
addCardBtn.addEventListener('click', () => {
    if (questionInput.value == "" || answerInput == "") {
        invalidInputModal.classList.add("show")
    }
    else {
        saveInputs()
        questionInput.value = ""
        answerInput.value = "" 
    }
    
})

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

