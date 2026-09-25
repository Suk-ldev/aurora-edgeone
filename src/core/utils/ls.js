import Vue from 'vue'
import Vuels from 'vue-ls'

Vue.use(Vuels, {
  namespace: '__AURORA__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
})

export const Authorization = 'authorization'
export const Darkmode = 'Darkmode'
export const Language = 'Language'
export const Notice = 'Notice'

export default Vue.ls
