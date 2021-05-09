export default {
  SET (state, params) {
    state[params['module']][params['key']] = params['value']
  },
  COMMIT_SET (state, params) {
    state[params['key']] = params['value']
  },
}