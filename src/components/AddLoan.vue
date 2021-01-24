<template>
  <div class="p-fluid">
    <div class="p-field">
      <label for="field-loan-name">Loan Name</label>
      <InputText id="field-loan-name" type="text" v-model="loanName" ></InputText>
    </div>
    <div class="p-d-flex p-flex-column p-flex-md-row">
      <div class="p-field p-mb-9 p-mr-9">
        <label for="field-loan-amount">Original Loan Amount</label>
        <InputNumber id="field-loan-amount" v-model="loanAmount" mode="currency" currency="USD" :minFractionDigits="2" @input="needReCalc=true"></InputNumber>
      </div>
      <div class="p-field p-mb-3 p-mr-3">
        <label for="field-interest-rate">Interest Rate</label>
        <InputNumber id="field-interest-rate" v-model="interestRate" mode="decimal" :minFractionDigits="3" suffix="%" @input="needReCalc=true"></InputNumber>
      </div>
    </div>
    <!--<h3>Loan Length</h3> -->
    <label for="loan-length-radios">Loan Length</label>
    <div id="loan-length-radios" class="p-formgroup-inline">
      <div v-for="term of loanTerms" :key="term.key" class="p-field-radiobutton">
        <RadioButton id="loan-length-{{ term.key }}" :name="term.key" :value="term.key" v-model="loanLength" @change="needReCalc=true"></RadioButton>
        <label for="loan-length-{{ term.key }}">{{term.label}}</label>
      </div>
    </div>
    <div class="p-grid p-jc-between p-ai-end">
      <div class="p-col p-text-left p-py-auto">
        <h3>${{ paymentAmount }} / month</h3>
      </div>
      <div class="p-col-fixed" style="width:150px">
        <div class="p-grid">
          <div class="p-col-fixed" style="width:50px">
            <Button icon="pi pi-replay" class="p-button-rounded p-button-text" :disabled="!needReCalc" @click="calculatePayment"></Button>
          </div>
          <div class="p-col-fixed" style="width:100px">
            <Button label="Add" icon="pi pi-angle-double-right" iconPos="right" class="p-button-sm p-button-outlined" @click="addLoan"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import Decimal from 'decimal.js'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from 'vuex'
import { amortSchedule } from '../maths.js'

export default defineComponent({
  name: 'AddLoan',
  emits: {
    'new-loan': null
  },
  setup() {
    const store = useStore();
    let loanName = ref('');
    let loanAmount = ref(100000.00);
    let interestRate = ref(3.75);
    let paymentAmount = ref(0);
    let loanTerms = [{label: '15 yrs', key: '15'}, {label: '30 yrs', key: '30'}];
    let loanLength = ref('30');
    let needReCalc = true;
    let reCalcDisabled = false;
    function calculatePayment() {
      let lAmount = new Decimal(loanAmount.value);
      let yearlyRate = new Decimal(interestRate.value);
      let monthlyInterestRate = yearlyRate.mul(.01).div(12);
      let numOfMonths = new Decimal(loanLength.value).mul(12);
      let onePlusMonthlyRate = monthlyInterestRate.add(1);
      let numerator = onePlusMonthlyRate.pow(numOfMonths);
      let denominator = onePlusMonthlyRate.pow(numOfMonths).minus(1);
      let payment = lAmount.mul(monthlyInterestRate).mul(numerator.div(denominator));
      paymentAmount.value = payment.toDecimalPlaces(2).toNumber();
      needReCalc = false;
    }
    function addLoan() {
      let loanObject = {
        uuid: uuidv4(),
        name: loanName.value,
        type: "Home",
        amount: loanAmount.value,
        term: loanLength.value,
        rate: interestRate.value,
        payment: paymentAmount.value,
        amort: amortSchedule(loanAmount.value, paymentAmount.value, interestRate.value, 0, 0)
      }
      store.commit('addLoan', loanObject);
      console.log("added new loan to store: " + loanObject.uuid);
      // context.emit('new-loan', loanObject)
    }
    return {
      loanName,
      loanAmount,
      loanLength,
      interestRate,
      paymentAmount,
      loanTerms,
      needReCalc,
      reCalcDisabled,
      calculatePayment,
      addLoan
    }
  }
})
</script>
