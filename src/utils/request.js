import axios from 'axios'
// import { notification, modal } from 'ant-design-vue'
import modal from 'ant-design-vue/lib/modal'
import notification from 'ant-design-vue/lib/notification'

import moment from 'moment'
import store from '../store'
import db from './localstorage'
import { setTimeout } from 'timers'
moment.locale('zh-cn')
let API
let baseURL = 'test' // 模拟 {mock} 开发 {dev} 测试 {test} 正式 {server}
switch (baseURL) {
  case 'mock':                             
    API = 'https://www.easy-mock.com/mock/5d5fae1ef4427537d64d5ee5/example/'
    break
  case 'dev':
    API = 'http://10.10.21.12:8888/backend/'
    // API = 'http://10.10.21.10:8888/backend/'
    break
  case 'test':
    API = 'http://followup.yibojk.com/backend/'
    break
  case 'server':
    API = 'https://localhost:8888/'
    break
}

let FEBS_REQUEST = axios.create({
  baseURL: API,
  responseType: 'json',
  validateStatus (status) {
    // 200 外的状态码都认定为失败
    return status === 200
  }
})

// 拦截请求
FEBS_REQUEST.interceptors.request.use((config) => {
  let expireTime = store.state.account.expireTime
  let now = moment().format('YYYYMMDDHHmmss')
  // 让token早10秒种过期，提升“请重新登录”弹窗体验
  if (now - expireTime >= -10) {
    modal.error({
      title: '登录已过期',
      content: '很抱歉，登录已过期，请重新登录',
      okText: '重新登录',
      mask: false,
      onOk: () => {
        return new Promise(() => {
          db.clear()
          location.reload()
        })
      }
    })
  }

  if (store.state.account.token) {
    config.headers.Authentication = store.state.account.token
    config.headers.Type = 'manage'
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截响应
FEBS_REQUEST.interceptors.response.use((config) => {
  return config
}, (error) => {
  if (error.response) {
    let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    switch (error.response.status) {
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到',
          duration: 4
        })
        break
      case 403:
      case 401:
        notification.warn({
          message: '系统提示',
          description: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
          duration: 4
        })
        setTimeout(() => {
          localStorage.clear()
          location.reload()
        }, 2500)
        break
      default:
        notification.error({
          message: '系统提示',
          description: errorMessage,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
})
const request = {
  post (url, params, isRaw) {
    // 当前为登录需要用form 但其他表单提交用的raw 类型
    if (isRaw) {
      return FEBS_REQUEST.post(url, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else {
      return FEBS_REQUEST.post(url, params, {
        transformRequest: [(params) => {
          let result = ''
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
          return result
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
  },

  put (url, params, isRaw) {
    if (isRaw) {
      return FEBS_REQUEST.put(url, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      // return FEBS_REQUEST.put(url, params, {
      //   transformRequest: [(params) => {
      //     let result = ''
      //     Object.keys(params).forEach((key) => {
      //       if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      //         result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
      //       }
      //     })
      //     return result
      //   }],
      //   headers: {
    //       'Content-Type': 'application/json'
      //   }
      // })
    } else {
      return FEBS_REQUEST.put(url, params, {
        transformRequest: [(params) => {
          let result = ''
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
          return result
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
  },
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return FEBS_REQUEST.get(`${url}${_params}`)
  },
  delete (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return FEBS_REQUEST.delete(`${url}${_params}`)
  },
  export (url, params = {}) {
    return FEBS_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      const fileName = `${new Date().getTime()}_导出结果.xlsx`
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch(error => {
      this.$message.warning(error)
    })
  },
  download (url, params, filename) {
    return FEBS_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, filename)
      }
    }).catch(() => {
    })
  },
  upload (url, params) {
    return FEBS_REQUEST.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default request
