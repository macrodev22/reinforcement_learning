class Agent {
    // Path, qTable
    constructor(environment) {
        this.environment = environment

        this.qTable = Array.from({ length: this.environment.state.length }, () => Array.from({ length: environment.state[0].length }, () => { return{ up: 0, left: 0, right: 0, down: 0 }}))
        this.alpha = 0.4 // Learning rate
        this.gamma = 0.9 // Discount factor
        this.epsilon = 0.5 // Exploration rate
    }

    get envStartPoint() {
        return this.environment.startPoint
    }

    chooseAction(state) {
        // Epsilon greedy selection
        if(Math.random() < this.epsilon) {
            // Explore
            const actions = ['up', 'down', 'left', 'right']
            return actions[Math.floor(Math.random() * actions.length)]
        } else {
            // Exploit
            const { x, y } = state
            // Return highest Q Value param
            const stateQValues = this.qTable[y][x]
            return Object.keys(stateQValues)
            .reduce((prev, curr) => stateQValues[prev] > stateQValues[curr] ? prev : curr)
        }
    }

    getReward(state) {
        const { x, y } = state

        const { x: goalX, y: goalY } = this.environment.goalState
        if (this.environment.state[y][x] === 1) return -10 // Wall penalty
        else if (x === goalX && y === goalY) return 10 // Goal reward
        else return -1
    }

    // 𝑄(𝑠,𝑎)←𝑄(𝑠,𝑎)+𝛼[𝑟 + 𝛾max𝑎′𝑄(𝑠′,𝑎′) − 𝑄(𝑠,𝑎)]
    updateQValue(state, action, reward, nextState) {
        const { x, y } = state
        const { x: nextX, y: nextY } = nextState 

        const bestNextQValue = Object.values(this.qTable[nextY][nextX])
        .reduce((prev, curr) => prev > curr ? prev : curr)

        // Q Value update rule
        this.qTable[y][x][action] += this.alpha * (reward + this.gamma * bestNextQValue - this.qTable[y][x][action])
    }

    getNextState(state, action) {
        const { x, y } = state
        switch(action) {
            case 'up':
                return { x, y: Math.max(0, y - 1) }
            case 'down':
                return { x, y: Math.min(y + 1, this.environment.state.length - 1) }
            case 'left':
                return { x: Math.max(0, x - 1), y }
            case 'right': 
                return { x: Math.min(x + 1, this.environment.state[y].length - 1), y }
            default:
                console.error(`Invalid action: ${action}`)
                return state
        }
    }

    isTerminalState(state) {
        const { x, y } = state
        const { x: goalX, y: goalY } = this.environment.goalState 
        return x === goalX && y === goalY
    }

    train(episodes) {
        for (let i=0; i<episodes; i++) {
            // console.log('Training episode: ', i+1)
            let currentState = this.envStartPoint
            while(true) {
                const action = this.chooseAction(currentState)
                const nextState = this.getNextState(currentState, action)
                const reward = this.getReward(nextState)
                this.updateQValue(currentState, action, reward, nextState)

                currentState = nextState
                
                if(this.isTerminalState(nextState)) break
            }
        }
        console.log('Traininig done!😁')
    }


    findShortestPath() {
        // console.log('environment state', this.environment.state)
        this.train(1000)

        const path = []
        let currentState = this.envStartPoint
        while(!this.isTerminalState(currentState)) {
            const { x, y } = currentState
            // console.log('state', x,y)
            const stateQValues = this.qTable[y][x]
            const nextAction = Object.keys(stateQValues)
            .reduce((prev, curr) => stateQValues[prev] > stateQValues[curr] ? prev: curr)

            path.push(nextAction)

            const nextState = this.getNextState(currentState, nextAction)

            currentState = nextState
        }
        console.log(path)
        return path
    }
}

export default Agent