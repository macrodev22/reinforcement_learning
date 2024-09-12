import Environment from "./Environment.js"
import Agent from "./Agent.js"

const body = document.body

const environ = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
]

// const env = new Environment(new Array(10).fill([...new Array(10).fill(0)]))
const env = new Environment(environ)


const grid = body.querySelector('.grid')
const gridEls = Array.from({ length: env.state.length }, () => (new Array(env.state[0].length).fill(null)))
let path = []

const drawGrid = (state, startPoint = null, goalPoint = null) => {
    grid.innerHTML = ''

    const isStart = (i, j) => (startPoint && (i == startPoint.x && j == startPoint.y))
    const isGoal = (i,j) => (goalPoint && (i == goalPoint.x && j == goalPoint.y))

    for (let j=0; j < state.length; j++) {
        for(let i=0; i < state[j].length; i++) {
            // Cell
            const cell = document.createElement('div')
            cell.className = `cell ${state[j][i] ? 'wall' : ''} ${isStart(i,j) ? 'start': ''} ${isGoal(i,j) ? 'goal': ''}`
            cell.dataset.i = i
            cell.dataset.j = j
            grid.appendChild(cell)
            gridEls[j][i] = cell
            // Event listener
            cell.addEventListener('click', (e) => {
                const oldValue = state[j][i]
                state[j][i] = oldValue == 0 ? 1 : 0
                if(oldValue) {
                    cell.classList.remove('wall')
                } else cell.classList.add('wall')
            })
            
        }
    }
}

const plotPath = () => {
    const currentCell = {...env.startPoint}

    for(let i=0; i < path.length; i++) {
        const action = path[i]
        switch (action) {
            case 'up':
                currentCell.y -= 1
                break
            case 'down':
                currentCell.y += 1
                break
            case 'left':
                currentCell.x -= 1
                break
            case 'right':
                currentCell.x += 1
                break
            default:
                console.error(`Invalid action: ${action}`)
                break
        }
        // console.log(currentCell, 'after', action)
        const { x,y } = currentCell
        // console.log(x,y,gridEls[y][x])
        gridEls[y][x].classList.add('path')
        gridEls[y][x].textContent = `${i+1}`
    }
}

drawGrid(env.state, env.startPoint, env.goalState)
body.querySelector('#shuffle-btn').addEventListener('click', () => { env.randomizeState(); drawGrid(env.state, env.startPoint, env.goalState) })

const agent = new Agent(env)
body.querySelector('#start-rl-btn').addEventListener('click', () => { path = agent.findShortestPath(); plotPath() })
const epsilonEl = body.querySelector("#epsilon")
const alphaEl = body.querySelector("#alpha")
const gammaEl = body.querySelector("#gamma")
epsilonEl.value = agent.epsilon
alphaEl.value = agent.alpha
gammaEl.value = agent.gamma

epsilonEl.addEventListener('change', (e) => {
    agent.epsilon = Number(e.target.value)
})
gammaEl.addEventListener('change', (e) => {
    agent.gamma = Number(e.target.value)
})
alphaEl.addEventListener('change', (e) => {
    agent.alpha = Number(e.target.value)
})


const showQTable = () => {
    let html = `
    <style>
        table {
            border-collapse: collapse; 
            width: 100%;
            max-width: 1120px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
            word-wrap: break-word; 
            white-space: normal;
            overflow-wrap: break-word;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
    <table>
    `
    for (let j=0; j<agent.qTable.length; j++) {
        html += '<tr>'
        for(let i=0; i<agent.qTable[j].length; i++) {
            html += `<td>(${i},${j}): 
            ${JSON.stringify(agent.qTable[j][i])}
            </td>`
        }
        html += '</tr>'
    }
    html += `</table>`

    const newWindow = window.open()
    newWindow.document.write(html)
}

body.querySelector('#q-table-btn').addEventListener('click', showQTable)