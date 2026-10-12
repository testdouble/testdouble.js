const supported = Number(process.versions.node.split('.')[0]) >= 22

if (process.argv[2] === 'not') {
  process.exit(!supported ? 0 : 1)
}
process.exit(supported ? 0 : 1)
