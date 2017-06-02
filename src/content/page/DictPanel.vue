<template>
<iframe class="saladict-panel"
  v-if="isShowPanel"
  key="saladict-panel"
  name="saladict-panel"
  panelBorder="0"
  :src="frameSource"
  :style="{top: panelTop + 'px !important', left: panelLeft + 'px !important', height: $store.getters.panelHeight + 'px !important'}"
></iframe>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'saladict-panel',
  data () {
    return {
      frameSource: chrome.runtime.getURL('panel.html')
    }
  },
  computed: mapState([
    'config',
    'isShowPanel',
    'panelTop',
    'panelLeft'
  ])
}
</script>

<style lang="scss">
iframe.saladict-panel {
  @extend %extreme-reset;
  position: fixed;
  z-index: $global-zindex-tooltip;
  overflow: hidden;
  width: 400px;
  box-shadow: rgba(0, 0, 0, 0.8) 0px 4px 23px -6px;
}
</style>
