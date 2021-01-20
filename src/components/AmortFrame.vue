<template>
  <div class="layout-content">
    <div class="p-grid p-jc-evenly">
      <div class="p-col-4">
        <Panel header="Add Loan">
          <AddLoan></AddLoan>
        </Panel>
      </div>
      <div class="p-col">
        <Panel header="Loans">
          <p>Loans will reside here</p>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import AddLoan from './AddLoan.vue'

export default {
  name: 'AmortFrame',
  components: {
    AddLoan
  }
}
</script>
