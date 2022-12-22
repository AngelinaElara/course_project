module.exports = {
  apps : [
    {
      name: 'course_project',
      script: 'server.js',
      watch: true,
      env: {
        'NODE_ENV': 'development'
      },
      env_production: {
        'NODE_ENV': 'production',
      }
    }
  ]
}