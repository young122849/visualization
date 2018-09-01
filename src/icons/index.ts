const load = (requireContext: any) => requireContext.keys().map(requireContext)
load(require.context('../icons/', false, /\.svg$/))
import Vue from 'vue'
import AppIcon from '@/commons/AppIcon.vue'
Vue.component('app-icon', AppIcon)