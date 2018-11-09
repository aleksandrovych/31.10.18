
function autobind(obj) {
  Object.keys(obj).filter(p => (typeof obj[p] === 'function')).forEach( p => (obj[p] = obj[p].bind(obj)) )
}

export default {autobind: autobind}
