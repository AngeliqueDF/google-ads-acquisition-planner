import { readFileSync } from 'node:fs'
import process from 'node:process'

const commitMessagePath = process.argv[2]

if (!commitMessagePath) {
  process.stderr.write('Usage: node scripts/validate-commit-message.mjs <commit-message-file>\n')
  process.exit(2)
}

const firstLine = readFileSync(commitMessagePath, 'utf8').split(/\r?\n/, 1)[0]
const conventionalCommitPattern = /^[a-z][a-z0-9-]*(?:\([a-z0-9._/-]+\))?!?: .+$/u

if (!conventionalCommitPattern.test(firstLine)) {
  process.stderr.write(
    'Commit message must follow Conventional Commits, e.g. "feat: add budget estimate".\n',
  )
  process.exit(1)
}

const firstLineLength = Array.from(firstLine).length

if (firstLineLength > 70) {
  process.stderr.write(`Commit subject is ${firstLineLength} characters; the maximum is 70.\n`)
  process.exit(1)
}
