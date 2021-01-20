import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Panel from 'primevue/panel'
import InputNumber from 'primevue/inputnumber'
import RadioButton from 'primevue/radiobutton'
import OverlayPanel from 'primevue/overlaypanel'

import 'primevue/resources/themes/vela-green/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'       //icons
import 'primeflex/primeflex.css'

const app = createApp(App);

app.use(PrimeVue);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Panel', Panel);
app.component('InputNumber', InputNumber);
app.component('RadioButton', RadioButton);
app.component('OverlayPanel', OverlayPanel);

app.mount('#app');
