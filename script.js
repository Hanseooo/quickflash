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
    newCard.classList.add("flashcard", "p-2", "rounded-4", "d-flex", "flex-column", "justify-content-between", "mx-2", "interactable")
    newCard.setAttribute('data-type', 'card')
    const cardBody = document.createElement('div')
    const divider = document.createElement('div')
    divider.classList.add("border-bottom", "divider", "border-dark")
    const displayQuestion = document.createElement('p')
    const displayAnswer = document.createElement('h3');
    newCard.classList.add("card-bg")
    displayAnswer.textContent = card.answer
    displayQuestion.textContent = card.question
    displayAnswer.setAttribute("style", "visibility: hidden;")
    displayAnswer.classList.add("mb-4", "text-center", "answer")
    newCard.appendChild(cardBody)
    cardBody.appendChild(divider)
    cardBody.appendChild(displayQuestion)
    newCard.appendChild(displayAnswer)
    cardContainer.appendChild(newCard)
    addAnimation(newCard, 'zoom_out')
    newCard.addEventListener('click', flipCard)
    function flipCard() {
        addAnimation(newCard, 'flip_y')
        if (displayAnswer.style.visibility == "hidden") {
            displayAnswer.style.visibility = "visible" 
        }
        else  {
            displayAnswer.style.visibility = "hidden"
        }
        newCard.removeEventListener('click', flipCard)
        newCard.addEventListener('animationend', () => {
            newCard.addEventListener('click', flipCard)
        })
    }
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
        window.jsparticles.pauseAnimation()
    }
    else {
        
        homeSection.style.display = "block"
        aboutSection.style.display = "block"
        cardSection.style.display = "block"
        playSection.style.display = "none"
        scoreCard.style.display = "none"
        instructionContainer.classList.remove('d-flex')
        window.jsparticles.resumeAnimation()
    }
}

    async function stopTimer() {
        clearInterval(timer)
        clearInterval(itemInterval)
        clearInterval(instructionTimer)
    }
    var timer, itemInterval, instructionTimer

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
            instructionTimer = setInterval(() => {
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

    exitBtn.disabled = true
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
        exitBtn.disabled = false
        await stopTimer()
    }
    
    stopBtn.addEventListener('click', async () => {
        await stopTimer()
        if (isReplay) {
            await isReplayExit()
            await playCard()
            
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
    
    exitBtn.addEventListener('click', () => {
        displayToggle(false)
        stopTimer()
        isReplayExit()
        cardSection.scrollIntoView()
    })

    async function isReplayExit() {
        stopBtn.textContent = "stop"
        scoreCard.style.display = "none"
        isReplay = false
        instructionContainer.classList.remove('d-flex')
        displayTimer.textContent = zeroPadding(0) + ":" + zeroPadding(0) + ":" + zeroPadding(0)
    }
}


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
        async function quizGame() {
            if (count >= cardIndexArray.length) {
                clearInterval(itemInterval)
                resolve()
                return
            }
            cardIndex = cardIndexArray[count]
            displayCardQuestion.textContent = cardStorage[cardIndex].question
            userInput.value = ""
            addAnimation(flashcardQuiz, 'flip_y2')
            console.log(cardStorage[cardIndex])
            console.log(cardStorage[cardIndex].question)
            nextBtn.replaceWith(nextBtn.cloneNode(true))
            userInput.replaceWith(userInput.cloneNode(true))
            nextBtn = document.querySelector('#next_btn')
            userInput = document.querySelector('#input_answer')
            count++
            userInput.focus()    

            nextBtn.addEventListener('click', async () => {
                await nextFlashCard(quizGame, cardIndex)
                return
            })
            userInput.addEventListener('keydown', async (event) => {
                if (event.key == 'Enter') {
                    await nextFlashCard(quizGame, cardIndex)
                    return
                }
            } )
            stopBtn.addEventListener('click', async () => {
                await nextFlashCard(quizGame, cardIndex)
                clearInterval(itemInterval)
                resolve()
                return
            })
        }
        quizGame()
        itemInterval = setInterval(quizGame, 10000)
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

    async function nextFlashCard(callback, cardIndex) {
        clearInterval(itemInterval);
        itemInterval = setInterval(callback, 10000);
        submitAnswer(cardIndex)
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

function addAnimation(element, animationClass) {
    element.classList.add(animationClass)
    element.addEventListener('animationend', ()=> element.classList.remove(animationClass))
}

const cardImg = document.querySelector('#card-img');
const lightningImg = document.querySelector('#quickflash-lightning')
const maxRotationX = 20;
const maxRotationY = 20; 

document.addEventListener('mousemove', heroCardProximityEffect)

function heroCardProximityEffect(event) {
    const { clientX, clientY } = event;
    const { left, top, width, height } = cardImg.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let rotationX = deltaY / 10; 
    let rotationY = -deltaX / 10; 

    rotationX = Math.max(-maxRotationX, Math.min(maxRotationX, rotationX));
    rotationY = Math.max(-maxRotationY, Math.min(maxRotationY, rotationY));

    const translateX = rotationY * 1.2; 
    const translateY = rotationX * 1.25; 

    const keyframes = {
        transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) translateX(${translateX}px) translateY(${translateY}px)`
    };

    const cardAnimation = cardImg.animate(keyframes, {
        duration: 2500,
        fill: 'forwards' 
    });

    const lightningAnimation = lightningImg.animate(keyframes, {
        duration: 6000,
        fill: 'forwards' 
    });

    cardAnimation.onfinish = () => {
        cardImg.style.transform = ''; 
        lightningImg.style.transform = '';
        lightningAnimation.cancel();
        cardAnimation.cancel()
    };
}

document.addEventListener('click', heroCardProximityEffect)



window.onload = () => {
    window.jsparticles = Particles.init ({
        selector: '.background',
        connectParticles: true,
        maxParticles: 30,
        minDistance: 150,
        color: '#505050',
    
        responsive: [
            {
                breakpoint: 940,
                options: {
                    maxParticles: 27,
                    minDistance: 150,
                }
            },
            {
                breakpoint: 768,
                options: {
                    maxParticles: 25,
                    minDistance: 125,
                }
            },
             {
                breakpoint: 566,
                options: {
                    maxParticles: 20,
                    minDistance: 115,
                }
             },
             {
                breakpoint: 425,
                options: {
                    maxParticles: 15,
                    minDistance: 100,
                }
             }
        ],
      });
      
};

window.onresize = () => {  
    const background = document.querySelectorAll('.background');
    let W = window.innerWidth;
    let H = window.innerHeight;
    background.forEach(function(element) {
        element.style.width = '95vw';
        element.style.height = H + 'px'; 
    })
 }
 

 const entryset = document.querySelectorAll('.entryset');
 const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
            }
        else {
            entry.target.classList.remove('show-element');
        }
    },
    
)
 },
 {
    threshold: 0.75,
    rootMargin: -5 + 'px',
 })
entryset.forEach(element => {
    observer.observe(element);
})

const trailer = document.querySelector('#trailer');
const trailerIcon = document.querySelector('#trailer-icon');
const body = document.querySelector('body')

const animateTrailer = (e, isInteracting) => {
    const x = e.clientX - trailer.offsetWidth / 2,
    y = e.clientY - trailer.offsetHeight / 2

    const keyframes = {
        transform: `translate(${x}px, ${y}px) scale(${isInteracting ? 5 : 1})`
    }

    trailer.animate(keyframes, {
        duration: 750,
        fill: 'forwards',
    })
}

window.onmousemove = (e) => {
    if (window.matchMedia('(pointer: fine)').matches) {
        const interactable = e.target.closest(".interactable"),
        isInteracting = interactable !== null
        animateTrailer(e, isInteracting)
        if (isInteracting) {
            setTrailerIcon(interactable.dataset.type, isInteracting)
        }
        else {
            setTrailerIcon('default', false)
        }
    }
    else {
        trailer.style.display = 'none'
    }
}

function setTrailerIcon(type, isInteracting) {
    console.log(type)
    switch(type) {
        case 'link': 
        case 'button':
            trailer.style.backgroundColor = "transparent";
            trailerIcon.textContent = ''
            break;
        case 'nav-link':
            trailer.style.backgroundColor = "transparent";
            trailerIcon.textContent = ''
            trailer.style.outline = "2px solid white"
            break;
        case 'checkbox':
            trailer.style.backgroundColor = "transparent";
            trailerIcon.textContent = 'highlight_mouse_cursor'
            trailerIcon.classList.add('text-dark')
            body.classList.add('hide-cursor')
            break;
        case 'card':
            trailer.style.backgroundColor = "transparent";
            trailerIcon.textContent = 'highlight_mouse_cursor'
            trailer.style.outline = "none"
            trailerIcon.classList.add('text-dark')
            document.body.style.cursor = 'none';
            break;
        case 'hero-card':
            trailerIcon.textContent = 'sentiment_very_satisfied'
            trailerIcon.classList.remove('text-dark')
            document.body.style.cursor = 'none';
            trailer.style.backgroundColor = "#393939";
            break;
        case 'hero-card-container':
            trailerIcon.textContent = 'sentiment_content'
            trailerIcon.classList.remove('text-dark')
            document.body.style.cursor = 'none';
            trailer.style.backgroundColor = "#393939";
            break;
        case 'input':
            trailerIcon.textContent = 'edit'
            trailer.style.outline = "none"
            trailer.style.backgroundColor = "transparent";
            trailerIcon.classList.add('text-dark')
            document.body.style.cursor = 'none';
            break;
        default:
            trailerIcon.textContent = 'donut_large'
            trailer.style.backgroundColor = "#393939";
            trailerIcon.classList.remove('text-dark')
            trailer.style.outline = "1.5px solid #393939"
            document.body.style.cursor = 'default';
    }
}
