// Vuex store for shared state using the Flux model

import { createStore } from 'vuex'

function loanHelper(objList) {
    let newList = [];
    let loan;
    for (loan of objList) {
        newList.push(loan.uuid);
    }
    return newList
}

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    loansMap: new Map(),
    loanList: [],
    selectedLoans: []
}

const getters = {
    loanCount (state) {
        return state.loans.length
    },
    selectedLoanCount (state) {
        return state.selectedLoans.length
    },
    selectedLoans (state) {
        return state.selectedLoans
    },
    getLoans (state) {
      return state.loanList
    },
    getLoanIndexByUuid: (state) => (uuid) => {
        console.log(loanHelper(state.loanList));
        for (let i = 0; i < state.loanList.length; i++) {
            if (uuid === state.loanList[i].uuid) {
                return i
            }
        }
        return null
    }
}

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    addLoan (state, loan) {
        state.loansMap.set(loan.uuid, loan);
        state.loanList.push(loan);
    },
    updateSelectedLoans(state, newSelectedLoans) {
        state.selectedLoans = newSelectedLoans;
        console.log("updated selected loans in state.");
    }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    deleteLoan({ state, getters }, uuid) {
        // Delete from main loan map
        state.loansMap.delete(uuid);
        console.log("deleted from loan map: " + uuid);
        // Delete from loan list and order mapping
        let index = getters.getLoanIndexByUuid(uuid);
        if (index != null) {
            state.loanList.splice(index, 1);
            console.log("deleted from loan list: " + uuid);
        } else {
            console.log("did not find deleted loan in loan list: " + uuid);
        }
        // Deletion from selected loans is handled in the DebtRows component
    }
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default createStore({
    state,
    getters,
    actions,
    mutations
})