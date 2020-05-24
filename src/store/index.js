import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
    token: window.sessionStorage.getItem('token'),
    stuId: ''
};
const mutations = {
    //更改token的值
    LOGIN: (state, data) => {
        state.token = data;
        window.sessionStorage.setItem('token', data);
    },
    //登出的时候要清除token
    LOGOUT: (state) => {
        state.token = null;
        window.sessionStorage.removeItem('token');
    },
    USERNAME: (state, data) => {
        //把用户名存起来
        state.stuId = data;
        window.sessionStorage.setItem('stuId', data);
    }
};
const actions = {
    UserLogin({commit}, data) {
        commit('LOGIN', data);
    },
    UserLogout({commit}) {
        commit('LOGOUT');
    },
    UserName({commit}, data) {
        commit('USERNAME', data);
    }
};
export default new Vuex.Store({
    state,
    mutations,
    actions
});