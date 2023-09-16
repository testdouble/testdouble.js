function canRegisterLoader () {
  const [major, minor] = process.versions.node
    .split('.')
    .map((m) => parseInt(m, 10))

  return major > 20 || (major === 20 && minor >= 6)
}

exports.canRegisterLoader = canRegisterLoader
