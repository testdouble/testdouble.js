module.exports = (arg) ->
  return 'undefined' if arg == undefined

  try
    JSON.stringify(arg) || arg?.toString?()
  catch e
    "[Circular Object]"

