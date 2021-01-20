<template>
  <div class="p-card">
    <h1>{{ props.msg }}</h1>
    <p>Count is: {{ count }}</p>
    <Button label="+1" class="p-button" @click="count++"></Button>
    <Button label="x2" class="p-button-danger" @click="doubleUp"></Button>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(props) {
    let count = ref(0);
    function doubleUp() {
      count.value *= 2
    }
    return {
      count,
      props,
      doubleUp
    }
  }
})
</script>