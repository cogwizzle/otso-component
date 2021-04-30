
const pascalCase = require('pascal-case').pascalCase

module.exports = {
  name: 'generate-card-trifold',
  alias: ['gct'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
    } = toolbox

    const name = parameters.first
    const properName = pascalCase(name)

    await generate({
      template: 'card-trifold-template.ts.ejs',
      target: `./${name}.tsx`,
      props: { name, properName },
    })

    info(`Generate Card trifold ./${name}.tsx`)
  },
}
