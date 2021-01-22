<template>
  <div class="layout-content">
    <div class="p-grid p-jc-evenly"><!--
      <div class="p-col-4">
        <Panel header="Add Loan">
          <AddLoan></AddLoan>
        </Panel>
      </div>-->
      <div class="p-col-4">
        <Card>
          <template #content>
            <DebtRows selected-loans="selectedLoans"></DebtRows>
          </template>
        </Card>
      </div>
      <div class="p-col-8">
        <AmortSchedule></AmortSchedule>
      </div>
    </div>
  </div>
</template>

<script>
//import AddLoan from './AddLoan.vue'
import DebtRows from './DebtRows'
import AmortSchedule from './AmortSchedule'

export default {
  name: 'AmortFrame',
  components: {
    AmortSchedule,
    DebtRows
  },
  setup() {
    let selectedLoans = ref([])
  }
}
</script>
