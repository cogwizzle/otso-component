
const pascalCase = require('pascal-case').pascalCase

module.exports = {
  name: 'generate-card-trifold',
  alias: ['gct'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
      prompt,
    } = toolbox

    const results = await prompt.ask([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
      },
      {
        type: 'input',
        name: 'path',
        message: 'What is the path?',
        default: 'src/components/',
      }
    ])

    const name = results.name
    const path = results.path
    const properName = pascalCase(name)

    await generate({
      template: 'card-trifold-template.js.ejs',
      target: `${path}/${name}.jsx`,
      props: { name, properName },
    }).then(() => {
      return formatFile(
        `${path}/${name}.jsx`,
        `${path}/${name}.jsx`,
      )
    })

    info(`Generate Card trifold ./${name}.jsx`)
  },
}
