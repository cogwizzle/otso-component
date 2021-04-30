
import { GluegunToolbox } from 'gluegun'
import { pascalCase } from 'pascal-case'

module.exports = {
  name: 'generate-hero-page',
  alias: ['ghp'],
  run: async (toolbox: GluegunToolbox) => {
    toolbox.print.info('hello world');
    const {
      parameters,
      template: { generate },
      print: { info },
    } = toolbox

    const name = parameters.first
    const properName = pascalCase(name)

    await generate({
      template: 'hero-page-template.ts.ejs',
      target: `pages/${name}.tsx`,
      props: { name, properName },
    })

    info(`Generate hero page at pages/${name}.tsx`)
  },
}
