<template>
  <Toast position="top-right"></Toast>
  <DataTable :value="loans" @row-reorder="onRowReorder" class="p-datatable-sm">
    <template #header>
      <div class="p-datatable-header p-jc-between p-ai-center p-grid">
        <div class="p-col p-ai-center">
          <h1>Loans</h1>
        </div>
        <div class="p-col-fixed" style="width:100px">
          <Button label="Add" icon="pi pi-plus" class="p-button-sm p-button-outlined" @click="toggleLoanOverlay" aria-controls="overlay_panel"></Button>

          <OverlayPanel ref="addOp" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width:450px">
            <AddLoan @new-loan="addNewLoan"></AddLoan>
          </OverlayPanel>
        </div>
      </div>
    </template>
    <Column :rowReorder="true" headerStyle="width:3rem" :reorderableColumn="false"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="type" header="Type">
      <template #body="slotProps">
        <i class="pi" :class="getLoanIcon(slotProps.data.type)"></i>
        {{slotProps.data.type}}
      </template>
    </Column>
    <Column field="amount" header="Amount">
      <template #body="slotProps">
        {{toCurrency(slotProps.data.amount)}}
      </template>
    </Column>
    <Column field="term" header="Term"></Column>
    <Column field="rate" header="Rate">
      <template #body="slotProps">
        {{slotProps.data.rate}} %
      </template>
    </Column>
    <Column field="payment" header="Payment">
      <template #body="slotProps">
        {{toCurrency(slotProps.data.payment)}}
      </template>
    </Column>
    <Column headerStyle="width: 8rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
      <template #body="slotProps">
        <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="deleteRow(slotProps.data.name, slotProps.index)"></Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import { ref, defineComponent} from 'vue'
import Decimal from 'decimal.js'
import { useToast } from 'primevue/usetoast'
import AddLoan from './AddLoan'

export default defineComponent({
  name: 'DebtRows',
  components: {
    AddLoan
  },
  emit: ['select-loan', 'deselect-loan'],
  setup(props, context) {
    const addOp = ref(null)
    const toast = useToast();
    let columns = [
      {field: 'name', header: 'Name'},
      {field: 'type', header: 'Type'},
      {field: 'amount', header: 'Amount'},
      {field: 'term', header: 'Term'},
      {field: 'rate', header: 'Rate'},
      {field: 'payment', header: 'Payment'}
    ]
    let loans = ref([])
    /*let loans = ref([
      {name: "Test Loan 1", type: "Home", amount: "125000", term: "30", rate: "3.758", payment: 0, amort: {}},
      {name: "Test Loan 2", type: "Car", amount: "125000", term: "15", rate: "3.275", payment: 0, amort: {}},
      {name: "Test Loan 3", type: "School", amount: "125000", term: "30", rate: "2.875", payment: 0, amort: {}},
      {name: "Test Loan 1", type: "Home", amount: "125000", term: "30", rate: "3.758", payment: 0, amort: {}},
      {name: "Test Loan 2", type: "Car", amount: "125000", term: "15", rate: "3.275", payment: 0, amort: {}},
      {name: "Test Loan 3", type: "School", amount: "125000", term: "30", rate: "2.875", payment: 0, amort: {}},
      {name: "Test Loan 1", type: "Home", amount: "125000", term: "30", rate: "3.758", payment: 0, amort: {}},
      {name: "Test Loan 2", type: "Car", amount: "125000", term: "15", rate: "3.275", payment: 0, amort: {}},
      {name: "Test Loan 3", type: "School", amount: "125000", term: "30", rate: "2.875", payment: 0, amort: {}}
    ])*/
    function getLoanIcon(loanType) {
      switch(loanType) {
        case 'Home':
          return 'pi-home';

        case 'Car':
          return 'pi-circle-off';

        case 'School':
          return 'pi-book';

        default:
          return 'pi-question-circle';
      }
    }
    function calculatePayment(amount, term, rate) {
      let lAmount = new Decimal(amount);
      let yearlyRate = new Decimal(rate);
      let monthlyInterestRate = yearlyRate.mul(.01).div(12);
      let numOfMonths = new Decimal(term.value).mul(12);
      let onePlusMonthlyRate = monthlyInterestRate.add(1);
      let numerator = onePlusMonthlyRate.pow(numOfMonths);
      let denominator = onePlusMonthlyRate.pow(numOfMonths).minus(1);
      let payment = lAmount.mul(monthlyInterestRate).mul(numerator.div(denominator));
      return payment.toDecimalPlaces(2).toNumber();
    }
    function toCurrency(value) {
      const formatter = new Intl.NumberFormat(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          }
      )
      return formatter.format(value)
    }
    function onRowReorder(event) {
      loans.value = event.value
    }
    function deleteRow(name, index) {
      loans.value.splice(index, 1);
    }
    function addNewLoan(event) {
      console.log("NEW EVENT");
      console.log(event);
      addOp.value.hide();
      loans.value.push(event)
      toast.add({severity: 'success', summary: 'Loan Added', detail: 'Loan "' + event.name + '" was added', life: 2000})

    }
    function toggleLoanOverlay(event) {
      console.log(event);
      addOp.value.toggle(event);
    }
    function selectLoan(loanData) {
      context.emit('select-loan', loanData);
    }
    function deselectLoan(loanData) {
      context.emit('deselect-loan', loanData);
    }
    return {
      addOp,
      columns,
      loans,
      calculatePayment,
      toCurrency,
      onRowReorder,
      getLoanIcon,
      deleteRow,
      addNewLoan,
      toggleLoanOverlay,
      selectLoan,
      deselectLoan
    }
  }
})
</script>
