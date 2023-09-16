import { ParamsDebugger } from './classes/ParamsDebugger'
import { initLogger } from './modules/logger'

import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  initLogger()

  ParamsDebugger.initialize({ show: true })
})
