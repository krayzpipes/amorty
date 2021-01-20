<template>
  <AmortFrame></AmortFrame>
</template>

<script>
import { ref } from 'vue'
import AmortFrame from './components/AmortFrame.vue'

export default {
  name: 'App',
  components: {
    AmortFrame
  },
  setup() {
    let myMsg = ref('')
    return {
      myMsg
    }
  }
}
</script>

<style>
body {
  background-color: #17212f;
}

</style>
