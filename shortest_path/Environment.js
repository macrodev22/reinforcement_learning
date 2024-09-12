class Environment {
    // State, Rewards
    constructor(state) {
        this.state = state
        // this.startState = startState
        // this.goalState = goalState
        this.randomizeState()

    }

    get startPoint() {
        // First empty cell
        if(!this.state) return null
        for(let j=0; j<this.state.length; j++) {
            for(let i=0; i<this.state[j].length; i++) {
                if (this.state[j][i] == 0) {
                    return { x: i, y: j }
                }
            }
        }
    }

    get goalState() {
        //Last empty cell
        if(!this.state) return null
        for(let j = this.state.length-1; j>=0; j--) {
            for(let i = this.state[j].length-1; i>=0; i--) {
                if (this.state[j][i] == 0) {
                    return { x: i, y: j }
                }
            }
        }
    }

    randomizeState() {
        for (let i=0; i<this.state.length; i++) {
            for(let j=0; j<this.state[i].length; j++) {
                this.state[i][j] = Math.round(Math.random())
            }
        }
    }
}

export default Environment