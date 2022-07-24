<template>
  <div class="colorPick-rect">
    <div class="colorPick-panel" ref="panel">
      <div class="colorPick-panel_pick" ref="panelPick" draggable="true"></div>
    </div>
    <!-- 色相谱 -->
    <div class="colorPick-panel_colorBar" ref="hub">
      <div class="colorPick-panel_colorBar_contain">
        <div class="colorPick-panel_colorBar_pick" draggable="true" ref="hueThumb"></div>
      </div>
    </div>
    <div class="colorPick-panel_diy">
      <div class="colorPick-panel_draw">
        <div class="colorPick-panel_draw-pickImg"></div>
      </div>
      <div class="colorPick-panel_setColor"><input type="text" /></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Draggable, Coordinate } from './draggable'

type Nullable<T> = T | null
type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
const panel = ref<ElRef>(null)
const panelPick = ref<ElRef>(null)
const hub = ref<ElRef>(null)
const hueThumb = ref<ElRef>(null)

// const state = reactive({})
// const
// hsv:色相（0-360），明度（0-1），饱和度（0-1），
//
function hueDrag(coordinate: Coordinate) {
  const { left } = coordinate
  hueThumb.value!.style.left = `${left}px`
  const hubWidth = hub.value!.offsetWidth
  const h = (left / hubWidth) * 360
  panel.value!.style.background = `hsl(${h}, 100%, 50%)`
}
function pickDrag(coordinate: Coordinate) {
  const { left, top } = coordinate
  console.log('left', left, top)
  // panelPick.value!.style.left = `${left}px`
  // panelPick.value!.style.top = `${top}px`
  // element.style.cssText=”width:20px;height:20px;border:solid 1px red;”;
}

onMounted(() => {
  console.log(' panelPick.value', panelPick.value)
  if (hub.value && panelPick.value) {
    const hubIns = new Draggable(hub.value, {
      drag: hueDrag,
      end: hueDrag
    })
    const pickIns = new Draggable(panelPick.value, {
      drag: pickDrag,
      end: pickDrag
    })
    console.log('hubIns', hubIns, pickIns)
  }
})
</script>

<style lang="scss" scoped>
.colorPick-rect {
  position: absolute;
  left: 305px;
  top: 50px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 10px 0 rgb(12 21 35 / 10%);
  box-sizing: border-box;
  padding: 12px;
  width: 268px;
  z-index: 999;
  .colorPick-panel {
    border-radius: 2px;
    cursor: pointer;
    height: 160px;
    overflow: hidden;
    position: relative;
    width: 100%;
    background-color: red;
    &_pick {
      background-color: transparent;
      border: 1px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 1px 0 rgb(0 0 0 / 40%);
      box-sizing: border-box;
      height: 14px;
      left: 0;
      position: absolute;
      top: 0;
      transform: translate(-50%, -50%);
      width: 14px;
      top: 5%;
      left: 19%;
      z-index: 10;
    }
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    // 饱和度 一条从左往右，由纯白到透明的径向渐变
    &::before {
      background: linear-gradient(to right, white, transparent);
    }

    // 明度 一条从下往上，由纯黑到透明的径向渐变
    &::after {
      background: linear-gradient(to top, black, transparent);
    }

    &_colorBar {
      background: linear-gradient(
        to right,
        #f00 0%,
        #ff0 16.66%,
        #0f0 33.33%,
        #0ff 50%,
        #00f 66.66%,
        #f0f 83.33%,
        #f00 100%
      );

      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      cursor: pointer;
      height: 8px;
      margin-top: 15px;
      position: relative;
      width: 100%;
      &_contain {
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        width: 100%;
      }
      &_pick {
        background: transparent;
        border: 4px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 2px 0 rgb(0 0 0 / 30%);
        box-sizing: border-box;
        cursor: pointer;
        height: 14px;
        left: 0;
        position: absolute;
        top: -4px;
        transform: translateX(-50%);
        width: 14px;
      }
    }
    &_diy {
      height: 32px;
      margin-top: 12px;
      width: 100%;
    }
    &_draw {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      box-sizing: border-box;
      cursor: pointer;
      float: left;
      height: 100%;
      margin-right: 10px;
      overflow: hidden;
      width: 32px;
      &-pickImg {
        background-color: #fff;
        background-image: url(https://static.chuangkit.com/tools/pc-design/prod/09fb355414e51c315ba7.svg);
        background-repeat: no-repeat;
        background-size: 20px 20px;
        border: 5px solid #fff;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
      }
    }
    &_setColor {
      background: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      float: left;
      height: 100%;
      overflow: hidden;
      width: 200px;
      input {
        border: 1px solid transparent;
        box-sizing: border-box;
        color: #1b2337;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        height: 100%;
        outline: none;
        text-align: center;
        width: 100%;
      }
    }
  }
}
</style>
