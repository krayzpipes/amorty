<template>
  <Chart type="line" :data="chartData" :options="chartOptions"></Chart>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AmortGraph',
  setup() {
    const store = useStore();
    // let loans = computed(() => store.getters.selectedLoans);
    let chartData = computed(() => getChartData());
    let lineColors = ['#81C784', '#F48FB1'];
    let chartOptions = {
      element: {
        point: {
          radius: 0
        }
      }
    }
    function getChartData() {
      //console.log("trying to graph loans: " + loanHelper(loans));
      let loans = store.getters.selectedLoans;
      let datasets = [];
      let labels;
      let longestTerm = 0;
      for (let i = 0; i < loans.length; i++) {
        console.log("graphing loan: " + loans[i].uuid)
        let periodCount = loans[i].amort.length;
        if (longestTerm < periodCount) {
          console.log("Longest is now " + periodCount);
          longestTerm = periodCount;
          labels = getLabels(loans[i]);
        }
        datasets.push({
          label: loans[i].name,
          data: getRemainingPrincipal(loans[i]),
          pointRadius: 0,
          hitRadius: 5,
          hoverRadius: 5,
          reactive: true,
          borderColor: lineColors[i],
          fill: false,
        })
      }
      return {
        labels: labels,
        datasets: datasets
      }
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
    function getLabels(loan) {
      let labels = [];
      let period;
      for (period of loan.amort) {
        labels.push(period.index);
      }
      return labels
    }
    function getRemainingPrincipal(loan) {
      let principals = [];
      let period;
      for (period of loan.amort) {
        principals.push(period.principal);
      }
      console.log("Principals for graph: " + principals)
      return principals
    }
    //function loanHelper(objList) {
      //console.log(objList);
      //let newList = [];
      //for (let i = 0; i < objList.length; i++) {
      //  newList.push(loans[i].uuid)
      //}
      //return newList
    //}
    return {
      chartOptions,
      toCurrency,
      chartData
    }
  }
})
</script>
