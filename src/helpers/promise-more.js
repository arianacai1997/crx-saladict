/**
 * Like Promise.all but is always successful.
 * @param {Array|Object} iterable
 * @returns {Promise} A promise with an array of all the resolved/rejected results. null for rejection.
 */
export const reflect = function reflect (iterable) {
  if (!Array.isArray(iterable)) {
    iterable = Array.from(iterable)
  }

  return Promise.all(iterable.map(p => Promise.resolve(p).catch(() => null)))
}

/**
 * Like Promise.all but only resolves if there is at least one resolution.
 * @param {Array|Object} iterable
 * @returns {Promise} A promise with an array.
 *  If resolved, the array consists of all the resolved/rejected results. null for rejection.
 *  Otherwise the array consists of all the rejected reasons.
 */
export const any = function any (iterable) {
  if (!Array.isArray(iterable)) {
    iterable = Array.from(iterable)
  }

  var rejectCount = 0
  var reasons = []
  var promises = iterable.map((p, i) => Promise.resolve(p).catch(e => {
    rejectCount++
    reasons[i] = e
    return null
  }))

  return Promise.all(promises)
    .then((resolutions) => {
      if (rejectCount === resolutions.length) {
        return Promise.reject(reasons)
      }
      return resolutions
    })
}

/**
 * Returns the first resolved value and only fails when all are rejected.
 * @param {Array|Object} iterable
 * @returns {Promise} If resovled, returns a promise with the first resolved result.
 *  Otherwise returns a promise with all the rejected reasons.
 */
export const first = function first (iterable) {
  if (!Array.isArray(iterable)) {
    iterable = Array.from(iterable)
  }

  var rejectCount = 0
  var reasons = []
  return new Promise((resolve, reject) => iterable.forEach((p, i) => {
    Promise.resolve(p).then(resolve).catch(e => {
      reasons[i] = e
      if (++rejectCount === iterable.length) {
        reject(reasons)
      }
    })
  }))
}

/**
 * A timer that support promise.
 * @param {number} [delay=0]
 * @returns {Promise} A promise with the timeoutID
 */
export const timer = function timer (delay = 0) {
  return new Promise(resolve => {
    var id = setTimeout(() => resolve(id), Number(delay) || 0)
  })
}

/**
 * Timeout a promise.
 * @param {} a promise, thenable or anything
 * @param {number} [delay=0] Zero means no timeout
 * @returns {Promise} A promise with the resolved/rejected result or rejected with the reason 'timeout'
 */
export const timeout = function timeout (pr, delay = 0) {
  delay = Number(delay)
  return new Promise((resolve, reject) => {
    Promise.resolve(pr).then(resolve, reject)
    if (delay > 0) {
      timer(delay).then(() => { reject('timeout') })
    }
  })
}

export default {
  reflect,
  any,
  first,
  timer,
  timeout
}
