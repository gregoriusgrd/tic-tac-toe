const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// Initialize variables for the game
let player = 'X'
let isPauseGame = false
let isGameStart = false

// Array to track the state of ech cell
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

// Array of win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonal
]

// Add click Event Listener to each cell

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {
    // Ensure cell is empty and game isn't paused
    if (cell.textContent == '' &&
        !isPauseGame
    ) {
        isGameStart = true
        updateCell(cell, index)

        // Do a random pick if there are no results
        if (!checkWinner()) {
            changePlayer()
            randomPick()
        }
    }
}

function updateCell(cell, index) {
    cell.textContent = player
    inputCells[index] = player
    cell.style.color = (player == 'X') ? '#2A7F62' : '#E67E22'
}

function changePlayer(){
    player = (player == 'X') ? 'O' : 'X'
}

function randomPick(){
    // Pause game to allow Computer to pick tile
    isPauseGame = true

    setTimeout(() => {
        let randomIndex
        do {
            // Pick a random index
            randomIndex = Math.floor(Math.random() * inputCells.length)
        } while (
            // Ensure the chosen cell is empty
            inputCells[randomIndex] != ''
        )
        
        // Update the cell with Computer move
        updateCell(cells[randomIndex], randomIndex, player)
        // Check if computer won
        if (!checkWinner()) {
            changePlayer()
            // Switch back to Human Player
            isPauseGame = false
            return
        }
        player = (player == 'X') ? 'O' : 'X'
    }, 1000) // Delay for the computer to move 1 second
}

function checkWinner() {
   for (const [a, b, c] of winConditions) {
        // Check each winning condition
        if (inputCells[a] == player &&
            inputCells[b] == player &&
            inputCells[c] == player
        ) {
            declareWinner([a, b, c])
            return true
        }
   }

   // Check for a draw (if all cells are filled)
   if (inputCells.every(cell => cell != '')){
        declareDraw()
        return true
   }
}

function declareDraw() {
    titleHeader.textContent = 'Draw! 😭'
    isPauseGame = true
    restartBtn.style.visibility = 'visible'
}

function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Win 🥳`
    isPauseGame = true

    // Highlight winning cells
    winningIndices.forEach((index) =>
        cells[index].style.background = '#A3D9C5'
    )

    restartBtn.style.visibility = 'visible'
}

function pickPlayer(selectedPlayer) {
    // Ensure the game hasn't started
    if(!isGameStart) {
        // Override the selected player value
        player = selectedPlayer
        if (player == 'X') {
            // Highlight X display
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            //Hightlight O display
            oPlayerDisplay.classList.add('player-active')
            xPlayerDisplay.classList.remove('player-active')
        }
    }
} 

restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    isPauseGame = false
    isGameStart = false
    titleHeader.textContent = 'Pick'
})

