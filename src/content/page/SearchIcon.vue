<template>
<transition name="saladict-jelly">
  <div class="saladict-icon"
    v-if="isShowIcon"
    key="saladict-icon"
    :style="{top: iconTop + 'px !important', left: iconLeft + 'px !important'}"
    @mouseenter="iconMouseenter"
    @mouseleave="iconMouseLeave"
  >
    <img class="saladict-icon__leaf" src="../../assets/leaf.svg">
    <img class="saladict-icon__orange" src="../../assets/orange.svg">
    <img class="saladict-icon__tomato" src="../../assets/tomato.svg">
    <img class="saladict-icon__bowl" src="../../assets/bowl.svg">
  </div>
</transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'saladict-icon',
  computed: mapState([
    'config',
    'isShowIcon',
    'iconTop',
    'iconLeft'
  ]),
  methods: {
    iconMouseenter () {
      // icon hiding takes 1s due to animation
      if (this.isShowIcon) {
        this.showPanelTimeout = setTimeout(() => {
          this.$store.commit('setShowPanel', true)
        }, 300)
      }
    },
    iconMouseLeave () {
      clearTimeout(this.showPanelTimeout)
    }
  }
}
</script>

<style lang="scss">
$icon-width: 30px;
div.saladict-icon {
  @extend %extreme-reset;
  position: fixed;
  z-index: $global-zindex-tooltip;
  overflow: hidden;
  width: $icon-width;
  height: $icon-width;
}

$tomato-rotate: 45deg;
$leaf-rotate: 30deg;

img.saladict-icon__leaf {
  @extend %extreme-reset;
  position: absolute;
  z-index: 1;
  top: 50 * $icon-width / 1024;
  left: 600 * $icon-width / 1024;
  width: $icon-width * 729 / 1024 * 0.6;
  height: $icon-width * 0.6;
  transform: rotate($leaf-rotate);
}

img.saladict-icon__orange {
  @extend %extreme-reset;
  position: absolute;
  z-index: 2;
  top: 0 * $icon-width / 1024;
  left: 195 * $icon-width / 1024;
  width: $icon-width * 0.6;
  height: $icon-width * 0.6;
}

img.saladict-icon__tomato {
  @extend %extreme-reset;
  position: absolute;
  z-index: 3;
  top: 250 * $icon-width / 1024;
  left: -117 * $icon-width / 1024;
  width: $icon-width * 0.6;
  height: $icon-width * 513 / 1024 * 0.6;
  transform: rotate($tomato-rotate);
}

img.saladict-icon__bowl {
  @extend %extreme-reset;
  position: absolute;
  z-index: 4;
  bottom: 0;
  left: 0;
  width: $icon-width;
  height: $icon-width * 530 / 1024;
}

/*-----------------------------------------------*\
    States
\*-----------------------------------------------*/
.saladict-jelly-enter-active {
  animation: saladict-jelly 1000ms linear;
}

.saladict-icon:hover {
  .saladict-icon__leaf {
    animation: saladict-leaf-shake 1s infinite linear;
  }
  .saladict-icon__orange {
    animation: saladict-orange-spin 1s infinite linear;
  }
  .saladict-icon__tomato {
    animation: saladict-tomato-shake 0.7s infinite linear;
  }
}

/* Generated with Bounce.js. Edit at https://goo.gl/Vn2Euz */

@keyframes saladict-jelly {
      0% { transform: matrix3d(0.500, 0, 0, 0, 0, 0.500, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
   3.40% { transform: matrix3d(0.658, 0, 0, 0, 0, 0.703, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
   4.70% { transform: matrix3d(0.725, 0, 0, 0, 0, 0.800, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
   6.81% { transform: matrix3d(0.830, 0, 0, 0, 0, 0.946, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
   9.41% { transform: matrix3d(0.942, 0, 0, 0, 0, 1.084, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.21% { transform: matrix3d(0.971, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  13.61% { transform: matrix3d(1.062, 0, 0, 0, 0, 1.166, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.070, 0, 0, 0, 0, 1.165, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  17.52% { transform: matrix3d(1.104, 0, 0, 0, 0, 1.120, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.106, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  21.32% { transform: matrix3d(1.098, 0, 0, 0, 0, 1.035, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.075, 0, 0, 0, 0, 0.980, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  25.23% { transform: matrix3d(1.067, 0, 0, 0, 0, 0.969, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.03% { transform: matrix3d(1.031, 0, 0, 0, 0, 0.948, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.024, 0, 0, 0, 0, 0.949, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.990, 0, 0, 0, 0, 0.981, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  36.74% { transform: matrix3d(0.986, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.980, 0, 0, 0, 0, 1.011, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  44.44% { transform: matrix3d(0.983, 0, 0, 0, 0, 1.016, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.996, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  59.86% { transform: matrix3d(1.003, 0, 0, 0, 0, 0.995, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.004, 0, 0, 0, 0, 0.996, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  75.28% { transform: matrix3d(1.001, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 1.000, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  90.69% { transform: matrix3d(1.000, 0, 0, 0, 0, 1.000, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    100% { transform: matrix3d(1.000, 0, 0, 0, 0, 1.000, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}

@keyframes saladict-leaf-shake {
    0% { transform: translate( 2px,  1px) rotate($leaf-rotate + 0deg); }
   10% { transform: translate(-1px, -2px) rotate($leaf-rotate - 1deg); }
   20% { transform: translate(-2px,    0) rotate($leaf-rotate + 1deg); }
   30% { transform: translate(   0,  2px) rotate($leaf-rotate + 0deg); }
   40% { transform: translate( 1px, -1px) rotate($leaf-rotate + 1deg); }
   50% { transform: translate(-1px,  2px) rotate($leaf-rotate - 1deg); }
   60% { transform: translate(-2px,  1px) rotate($leaf-rotate + 0deg); }
   70% { transform: translate( 2px,  1px) rotate($leaf-rotate - 1deg); }
   80% { transform: translate(-1px, -1px) rotate($leaf-rotate + 1deg); }
   90% { transform: translate( 2px,  2px) rotate($leaf-rotate + 0deg); }
  100% { transform: translate( 1px, -2px) rotate($leaf-rotate - 1deg); }
}

@keyframes saladict-orange-spin {
  from { transform: rotate(  0deg); }
    to { transform: rotate(360deg); }
}

@keyframes saladict-tomato-shake {
    0% { transform: rotate($tomato-rotate - 10deg); }
   30% { transform: rotate($tomato-rotate +  0deg); }
   60% { transform: rotate($tomato-rotate + 10deg); }
   90% { transform: rotate($tomato-rotate +  0deg); }
  100% { transform: rotate($tomato-rotate -  5deg); }
}
</style>
