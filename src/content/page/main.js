import Vue from 'vue'
import Vuex from 'vuex'
import defaultConfig from 'src/app-config'
import SearchIcon from './SearchIcon'
import DictPanel from './DictPanel'
import {storage, message} from 'src/helpers/chrome-api'

Vue.config.productionTip = false
Vue.use(Vuex)

var isActivated = false

const store = new Vuex.Store({
  state: {
    config: defaultConfig,

    isShowIcon: false,
    iconTop: 0,
    iconLeft: 0,

    isShowPanel: false,
    panelTop: 0,
    panelLeft: 0
  },
  mutations: {
    updateConfig (state, config) {
      state.config = config
    },
    setShowIcon (state, flag) {
      state.isShowIcon = flag
    },
    setShowPanel (state, flag) {
      state.isShowPanel = flag
    },
    setIconPosition (state, {top, left}) {
      state.iconTop = top
      state.iconLeft = left
    },
    setPanelPosition (state, {top, left}) {
      state.panelTop = top
      state.panelLeft = left
    }
  },
  getters: {
    panelHeight (state) {
      const allDicts = state.config.dicts.all
      // header + each dictionary
      const preferredHeight = 30 + state.config.dicts.selected.reduce((sum, id) => {
        let preferredHeight = 0
        if (allDicts[id] && allDicts[id].preferredHeight) {
          // header 20px
          preferredHeight = Number(allDicts[id].preferredHeight) + 20
        }
        return sum + preferredHeight
      }, 0)
      const maxHeight = window.innerHeight * 0.78
      return preferredHeight > maxHeight ? maxHeight : preferredHeight
    }
  }
})
const state = store.state

storage.listen('config', changes => {
  var config = changes.config.newValue
  store.commit('updateConfig', config)
  if ((config.active || config.tripleCtrl) && !isActivated) {
    activate()
  }
})

storage.sync.get('config').then(({config}) => {
  store.commit('updateConfig', config)
  if (config.active || config.tripleCtrl) {
    activate()
  }
})

function activate () {
  var vmIcon = new Vue({store, render: h => h(SearchIcon)}).$mount()
  var vmPanel = new Vue({store, render: h => h(DictPanel)}).$mount()

  document.body.appendChild(vmIcon.$el)
  document.body.appendChild(vmPanel.$el)

  var selectedText = ''
  // pin the panel
  var isStayVisiable = false
  var isTripleCtrl = false

  var firstClickOfDoubleClick = false
  function clearDoubleClick () {
    firstClickOfDoubleClick = false
  }

  var panelMouseX, panelMouseY, pageMouseX, pageMouseY

  function handleDragStart (mouseX, mouseY) {
    panelMouseX = mouseX
    panelMouseY = mouseY
    pageMouseX = state.panelLeft + mouseX
    pageMouseY = state.panelTop + mouseY

    // attach dragging listeners
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('mousemove', handlePageMousemove)
  }

  function handleDragEnd () {
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('mousemove', handlePageMousemove)
  }

  function handlePanelMousemove (mouseX, mouseY) {
    let offsetX = mouseX - panelMouseX
    let offsetY = mouseY - panelMouseY

    store.commit('setPanelPosition', {
      top: state.panelTop + offsetY,
      left: state.panelLeft + offsetX
    })
    vmPanel.$forceUpdate()

    pageMouseX += offsetX
    pageMouseY += offsetY
  }

  function handlePageMousemove ({clientX, clientY}) {
    store.commit('setPanelPosition', {
      top: state.panelTop + clientY - pageMouseY,
      left: state.panelLeft + clientX - pageMouseX
    })
    vmPanel.$forceUpdate()

    pageMouseX = clientX
    pageMouseY = clientY
  }

  window.addEventListener('message', ({data}) => {
    if (data) {
      switch (data.msg) {
        case 'SALADICT_DRAG_START':
          handleDragStart(data.mouseX, data.mouseY)
          store.commit('setShowIcon', false)
          break
        case 'SALADICT_DRAG_MOUSEMOVE':
          handlePanelMousemove(data.mouseX, data.mouseY)
          break
        case 'SALADICT_DRAG_END':
          handleDragEnd()
          break
      }
    }
  })

  // receive signals from page and all panels
  message.on('SELECTION', (data, sender, sendResponse) => {
    const {text, mouseX, mouseY} = data

    selectedText = text || ''

    if (isStayVisiable) {
      if (text) {
        message.send({msg: 'SEARCH_TEXT_SELF', text: text})
      }
      return
    }

    if (state.isShowIcon || state.isShowPanel) {
      store.commit('setShowIcon', false)
      store.commit('setShowPanel', false)
      vmIcon.$forceUpdate()
      vmPanel.$forceUpdate()
    }

    // check double click
    if (state.config.mode === 'double') {
      if (firstClickOfDoubleClick) {
        firstClickOfDoubleClick = false
      } else {
        firstClickOfDoubleClick = true
        setTimeout(clearDoubleClick, 200)
        return
      }
    }

    // icon position
    //             +-----+
    //             |     |
    //             |     | 30px
    //        60px +-----+
    //             | 30px
    //             |
    //       40px  |
    //     +-------+
    // cursor
    let iconLeft = mouseX + 40 + 30 > window.innerWidth ? mouseX - 40 - 30 : mouseX + 40
    let iconTop = mouseY > 60 ? mouseY - 60 : mouseY + 60 - 30

    store.commit('setIconPosition', {top: iconTop, left: iconLeft})

    // panel position based on icon position
    let panelHeight = store.getters.panelHeight

    let panelLeft = state.iconLeft + 30 + 10
    if (panelLeft + 400 > window.innerWidth) {
      panelLeft = state.iconLeft - 10 - 400
    }

    let panelTop = state.iconTop
    if (panelTop + panelHeight > window.innerHeight - 15) {
      panelTop = window.innerHeight - 15 - panelHeight
    }

    store.commit('setPanelPosition', {top: panelTop, left: panelLeft})

    if (text) {
      switch (state.config.mode) {
        case 'icon':
          store.commit('setShowIcon', true)
          break
        case 'direct':
          store.commit('setShowPanel', true)
          break
        case 'ctrl':
          if (data.ctrlKey) {
            store.commit('setShowPanel', true)
          }
          break
        case 'double':
          store.commit('setShowPanel', true)
          break
      }
    }
  })

  message.on('CLOSE_PANEL', () => {
    isStayVisiable = false
    store.commit('setShowPanel', false)
    store.commit('setShowIcon', false)
  })

  message.on('PIN_PANEL', (data) => {
    isStayVisiable = data.flag
    store.commit('setShowIcon', false)
  })

  message.on('PANEL_READY', (__, ___, sendResponse) => {
    if (isTripleCtrl) {
      // the panel is opened by triple ctrl
      isTripleCtrl = false
      return sendResponse({ctrl: true})
    }

    if (selectedText) {
      message.send({msg: 'SEARCH_TEXT_SELF', text: selectedText})
    }
  })

  message.on('TRIPLE_CTRL', () => {
    isTripleCtrl = true
    // show panel
    store.commit('setShowIcon', false)
    store.commit('setShowPanel', false)
    vmPanel.$nextTick(() => {
      store.commit('setPanelPosition', {
        top: window.innerHeight / 2 - store.getters.panelHeight / 2,
        left: window.innerWidth / 2 - 400 / 2
      })
      store.commit('setShowPanel', true)
    })
  })

  isActivated = true
}
