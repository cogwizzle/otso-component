
const pascalCase = require('pascal-case').pascalCase

module.exports = {
  name: 'generate-hero-page',
  alias: ['ghp'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
    } = toolbox

    const name = parameters.first
    const properName = pascalCase(name)

    await generate({
      template: 'hero-page-template.ts.ejs',
      target: `src/pages/${name}.tsx`,
      props: { name, properName },
    })

    info(`Generate hero page at pages/${name}.tsx`)
  },
}
