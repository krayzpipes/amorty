import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Panel from 'primevue/panel'
import InputNumber from 'primevue/inputnumber'
import RadioButton from 'primevue/radiobutton'
import OverlayPanel from 'primevue/overlaypanel'
import DataTable from 'primevue/datatable'
import SplitButton from 'primevue/splitbutton'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Column from 'primevue/column'
import DropDown from 'primevue/dropdown'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import 'primevue/resources/themes/vela-green/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'       //icons
import 'primeflex/primeflex.css'

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Panel', Panel);
app.component('InputNumber', InputNumber);
app.component('RadioButton', RadioButton);
app.component('OverlayPanel', OverlayPanel);
app.component('DataTable', DataTable);
app.component('SplitButton', SplitButton);
app.component('Toast', Toast);
app.component('Column', Column);
app.component('DropDown', DropDown);
app.component('Card', Card);
app.component('Dialog', Dialog);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);

app.mount('#app');
