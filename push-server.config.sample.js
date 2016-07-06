var config = {
  beta: {
    GCM_API_KEY: null, // TODO
  },
  development: {
    GCM_API_KEY: '<found in google developer console>',
  },
}

module.exports = config[process.env.NODE_ENV];
