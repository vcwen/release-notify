const core = require('@actions/core')
const github = require('@actions/github')
const mailer = require('nodemailer')

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
  const mail = {
    from: `"${core.getInput('sender')}" <${core.getInput('from')}>`,
    to: core.getInput('to'),
    subject: 'Release Note',
    html: core.getInput('body')
  }
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`)
  transport.sendMail(mail).catch((err) => {
    core.setFailed(err.message)
  })
} catch (error) {
  core.setFailed(error.message)
}
