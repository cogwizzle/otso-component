
const pascalCase = require('pascal-case').pascalCase
const formatFile = require('../prettier/format-file').formatFile
const uuid = require('uuid').v4
const readFile = require('fs').readFileSync

module.exports = {
  name: 'generate-hero-page',
  alias: ['ghp'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
      prompt,
      filesystem: { copy }
    } = toolbox

    const results = await prompt.ask([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
      }
    ])

    const name = results.name
    const properName = pascalCase(name)
    const imageId = uuid();

    await generate({
      template: 'hero-page-template.js.ejs',
      target: `src/pages/${name}.jsx`,
      props: { name, properName, imageId },
    }).then(() => {
      return formatFile(
        `src/pages/${name}.jsx`,
        `src/pages/${name}.jsx`,
      )
    })

    copy(
      'node_modules/poc-cli-component/templates/hero-page.jpg',
      `src/pages/assets/${imageId}.jpg`
    )

    info(`Generate hero page at pages/${name}.jsx`)
  },
}
