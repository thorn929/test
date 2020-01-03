import db from '@/utils/localstorage'

export default {
  namespaced: true,
  state: {
    sidebar: {
      opened: true
    },
    theme: db.get('THEME', 'dark'),
    layout: db.get('LAYOUT', 'side'),
    systemName: '随访系统',
    multipage: getBooleanValue(db.get('MULTIPAGE'), true),
    fixSiderbar: getBooleanValue(db.get('FIX_SIDERBAR'), true),
    fixHeader: getBooleanValue(db.get('FIX_HEADER'), true),
    color: db.get('COLOR', 'rgb(24, 144, 255)'),
    copyright: '臻和科技'
  },
  mutations: {
    setSidebar (state, type) {
      state.sidebar.opened = type
    },
    fixSiderbar (state, flag) {
      db.save('FIX_SIDERBAR', flag)
      state.fixSiderbar = flag
    },
    fixHeader (state, flag) {
      db.save('FIX_HEADER', flag)
      state.fixHeader = flag
    }
  }
}

function getBooleanValue (value, defaultValue) {
  if (Object.is(value, null)) {
    return defaultValue
  }
  if (JSON.stringify(value) !== '{}') {
    return value
  } else {
    return false
  }
}
