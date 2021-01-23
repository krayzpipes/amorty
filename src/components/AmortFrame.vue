<template>
  <div class="layout-content">
    <div class="p-grid p-jc-evenly"><!--
      <div class="p-col-4">
        <Panel header="Add Loan">
          <AddLoan></AddLoan>
        </Panel>
      </div>-->
      <div class="p-col-6">
        <Card>
          <template #content>
            <DebtRows @select-loan="addSelectedLoan" @deselect-loan="deleteSelectedLoan"></DebtRows>
          </template>
        </Card>
      </div>
      <div class="p-col-6">
        <AmortSchedule :loans="selectedLoans"></AmortSchedule>
      </div>
    </div>
  </div>
</template>

<script>
//import AddLoan from './AddLoan.vue'
import { ref } from 'vue'
import DebtRows from './DebtRows'
import AmortSchedule from './AmortSchedule'

export default {
  name: 'AmortFrame',
  components: {
    AmortSchedule,
    DebtRows
  },
  setup() {
    let selectedLoans = ref([]);
    let loanTracking = {}
    function addSelectedLoan(loan) {
      console.log(loanTracking)
      loanTracking[loan.name] = selectedLoans.value.length;
      selectedLoans.value.push(loan);
      console.log(loanTracking);
    }
    function deleteSelectedLoan(loan) {
      console.log(loanTracking);
      selectedLoans.value.splice(loanTracking[loan.name], 1);
      console.log(loanTracking);
    }
    return {
      selectedLoans,
      addSelectedLoan,
      deleteSelectedLoan
    }
  }
}
</script>
