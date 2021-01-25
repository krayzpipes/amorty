<template>
  <Toast position="top-right"></Toast>
  <DataTable :value="loans" v-model:selection="selectedData" selectionMode="multiple" dataKey="uuid" @row-select="selectLoan" @row-unselect="deselectLoan" :metaKeySelection="false" class="p-datatable-sm" :scrollable="true" scrollHeight="400px">
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
        <Button type="button" icon="pi pi-copy" class="p-button-rounded p-button-info p-button-text" @click="copyRow(slotProps.data)"></Button>
        <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="deleteRow(slotProps.data.uuid)"></Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import { ref, defineComponent, computed } from 'vue'
import Decimal from 'decimal.js'
import { useToast } from 'primevue/usetoast'
import AddLoan from './AddLoan'
import { useStore } from 'vuex'
import {v4 as uuidv4} from "uuid";
import {amortSchedule} from "@/maths";

export default defineComponent({
  name: 'DebtRows',
  components: {
    AddLoan
  },
  setup() {
    const store = useStore();
    const addOp = ref(null);
    const toast = useToast();
    let columns = [
      {field: 'name', header: 'Name'},
      {field: 'type', header: 'Type'},
      {field: 'amount', header: 'Amount'},
      {field: 'term', header: 'Term'},
      {field: 'rate', header: 'Rate'},
      {field: 'payment', header: 'Payment'}
    ]
    let loans = computed(() => store.getters.getLoans);
    let selectedData = ref([])
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
    function deleteRow(uuid) {
      store.dispatch('deleteLoan', uuid);
      console.log("deleted loan: " + uuid);
      let index = findSelectedLoanIndex(uuid);
      if (index != null) {
        selectedData.value.splice(index, 1);
        syncSelectedLoans();
        console.log("deleted loan from selected loans: " + uuid);
      }
      console.log("Local selected loans: " + forEachHelper(selectedData.value));
      console.log("State selected loans: " + forEachHelper(store.getters.selectedLoans));
    }
    function addNewLoan(event) {
      // Actual loan is added to state/store in button component
      addOp.value.hide();
      toast.add({severity: 'success', summary: 'Loan Added', detail: 'Loan "' + event.name + '" was added', life: 2000})
    }
    function toggleLoanOverlay(event) {
      addOp.value.toggle(event);
    }
    function selectLoan(event) {
      syncSelectedLoans();
      console.log("Selected loan: " + event.data.uuid);
      console.log("Local selected loans: " + forEachHelper(selectedData.value));
      console.log("State selected loans: " + forEachHelper(store.getters.selectedLoans));
      //context.emit('select-loan', loanData.data);
    }
    function deselectLoan(event) {
      syncSelectedLoans();
      console.log("Deselected loan: " + event.data.uuid);
      console.log("Local selected loans: " + forEachHelper(selectedData.value));
      console.log("State selected loans: " + forEachHelper(store.getters.selectedLoans));
    }
    function syncSelectedLoans() {
      store.commit('updateSelectedLoans', selectedData.value);
    }
    function findSelectedLoanIndex(uuid) {
      for (let i = 0; i < selectedData.value.length; i++) {
        if (selectedData.value[i].uuid == uuid) {
          return i
        }
      }
      console.log("Should have found loan in selected data, but did not: " + uuid);
      return null
    }
    function copyRow(loanData) {
      let uuid = uuidv4();
      let loanObject = {
        uuid: uuid,
        name: loanData.name + "-" + uuid.substring(0, 4),
        type: loanData.type,
        amount: loanData.amount,
        term: loanData.term,
        rate: loanData.rate,
        payment: loanData.payment,
        amort: amortSchedule(loanData.amount, loanData.payment, loanData.rate, 0, 0)
      }
      store.commit('addLoan', loanObject);
      console.log("added new loan to store: " + loanObject.uuid);
      // context.emit('new-loan', loanObject)
    }
    function forEachHelper(objList) {
      let newList = [];
      let loan;
      for (loan of objList) {
        newList.push(loan.uuid);
      }
      return newList
    }
    //function
    //function deselectLoan(loanData) {
      //context.emit('deselect-loan', loanData.data);
    //}
    return {
      addOp,
      columns,
      loans,
      selectedData,
      calculatePayment,
      toCurrency,
      getLoanIcon,
      deleteRow,
      addNewLoan,
      toggleLoanOverlay,
      selectLoan,
      deselectLoan,
      copyRow
    }
  }
})
</script>
