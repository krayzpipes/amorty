<template>
  <TabView>
    <TabPanel v-for="loan in selectedLoans" :header="loan.name" :key="loan.uuid">
      <DataTable :key="loan.uuid" :value="loan.amort" class="p-datatable-sm" :scrollable="true" scrollHeight="400px" :loading="loading">
        <Column :key="loan.uuid" field="principal" header="Remaining Principal">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.principal)}}
          </template>
        </Column>
        <Column :key="loan.uuid" field="principalPayment" header="Principal">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.principalPayment)}}
          </template>
        </Column>
        <Column :key="loan.uuid" field="interestPayment" header="Interest">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.interestPayment)}}
          </template>
        </Column>
        <Column :key="loan.uuid" field="extraPayment" header="Extra Payment">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.extraPayment)}}
          </template>
        </Column>
        <Column :key="loan.uuid" field="lumpSum" header="Lump Sum">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.lumpSum)}}
          </template>
        </Column>
      </DataTable>
    </TabPanel>
  </TabView>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AmortSchedule',
  emit: ['update-row'],
  setup() {
    const store = useStore();
    let selectedLoans = computed(() => {
      return store.getters.selectedLoans
    })
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
    return {
      selectedLoans,
      toCurrency,
    }
  }
})
</script>
