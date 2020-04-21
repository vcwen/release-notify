const core = require('@actions/core')
const github = require('@actions/github')
const mailer = require('nodemailer')
// const fs = require('fs')
// const path = require('path')
const { Converter } = require('showdown')

try {
  const transport = mailer.createTransport({
    host: core.getInput('host'),
    port: core.getInput('port'),
    secure: true,
    auth: {
      user: core.getInput('user'),
      pass: core.getInput('password')
    }
  })
  const converter = new Converter()
  // const body = fs.readFileSync(path.resolve('README.md'))
  const release = github.context.payload.release
  const html = converter.makeHtml(release.body)
  const mail = {
    from: `"${core.getInput('sender')}" <${core.getInput('from')}>`,
    to: core.getInput('to'),
    subject: `Release Note ${release.tag_name}-${release.name}`,
    html
  }

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`)
  transport.sendMail(mail).catch((err) => {
    core.setFailed(err.message)
  })
} catch (error) {
  core.setFailed(error.message)
}
