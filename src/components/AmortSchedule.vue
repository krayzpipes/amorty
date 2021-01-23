<template>
  <TabView>
    <TabPanel v-for="loan in loans" :header="loan.name" :key="loan.name">
      <DataTable :key="loan.name" :value="loan.amort" class="p-datatable-sm" :scrollable="true" scrollHeight="400px" :loading="loading">
        <Column :key="loan.name" field="principal" header="Remaining Principal">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.principal)}}
          </template>
        </Column>
        <Column :key="loan.name" field="principalPayment" header="Principal">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.principalPayment)}}
          </template>
        </Column>
        <Column :key="loan.name" field="interestPayment" header="Interest">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.interestPayment)}}
          </template>
        </Column>
        <Column :key="loan.name" field="extraPayment" header="Extra Payment">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.extraPayment)}}
          </template>
        </Column>
        <Column :key="loan.name" field="lumpSum" header="Lump Sum">
          <template #body="slotProps">
            {{toCurrency(slotProps.data.lumpSum)}}
          </template>
        </Column>
      </DataTable>
    </TabPanel>
  </TabView>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AmortSchedule',
  props: ['loans'],
  emit: ['update-row'],
  setup() {
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
      toCurrency,
    }
  }
})
</script>
