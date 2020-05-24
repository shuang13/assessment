import Vue from 'vue'
import App from './App'
import router from './router'
import http from './service/http'
import api from './service/api'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
import { Modal, Message, Notice } from 'iview'
import ScoreRule from '@/components/ScoreRule'
import JsonExcel from 'vue-json-excel'
import store from './store'

Vue.use(iView);

Vue.component('downloadExcel', JsonExcel)

Vue.component('ScoreRule', ScoreRule)

Vue.config.productionTip = false

Vue.prototype.$Modal = Modal
Vue.prototype.$Message = Message
Vue.prototype.$Notice = Notice

Vue.prototype.$http = http // ajax请求
Vue.prototype.$api = api // api统一
Vue.prototype.$store = store


var vm = new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>',
    beforeCreate() {},
    created() {}
})