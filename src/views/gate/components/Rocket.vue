<template>
  <div class="rocket-container left-img">
    <div class="warp">
      <div class="img" @click="$router.push('/')">
        <lottie v-if="rocketOptions.animationData" :options="rocketOptions" class="in" :height="640" :width="640" @animCreated="handleAnimation" />
      </div>
      <div class="txt">
        <h2 class="tit">{{ descTitles[0] || '' }}</h2>
        <p class="desc">{{ descTitles[1] || '' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Lottie from 'vue-lottie'
import axios from 'axios'
import { STATIC_URL } from '@/core/constants'

export default {
  name: 'Rocket',
  components: {
    Lottie
  },
  data() {
    return {
      anim: {},
      rocketOptions: {
        animationData: null
      }
    }
  },
  computed: {
    descTitles() {
      return this.$appDesc.split('\n')
    }
  },
  mounted() {
    setTimeout(() => {
      axios.get(STATIC_URL + '/83245-rocket-launch.json').then((res) => {
        this.rocketOptions.animationData = res.data
      })
    }, 0)
  },
  methods: {
    handleAnimation(anim) {
      this.anim = anim
      this.anim.setSpeed(0.6)
    }
  }
}
</script>
