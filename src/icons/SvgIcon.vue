<template>
  <span class="svg-icon" :class="{ disabled }" :style="style" v-on="$listeners">
    <i :class="[iconName, iconWeight]"></i>
  </span>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      required: false,
      default: 'regular'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return 'ph-' + this.name
    },
    iconWeight() {
      return this.weight === 'regular' ? 'ph' : 'ph-' + this.weight
    },
    style() {
      if (this.size) {
        return { fontSize: this.size }
      }
      if (this.color) {
        return { color: this.color }
      }
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
  display: inline-block;
  line-height: 1;

  > i {
    display: block;
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
