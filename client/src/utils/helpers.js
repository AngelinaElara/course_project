export const validateInputNameValue = (value) => {
  if (!value.length) return false

  return value.length >= 3
    && value.search(/[^a-zа-я]+/gi) === -1 
    ? true
    : false
}

export const validateInputEmailValue = (value) => {
  if (!value.length) return false

  return value.search(/[a-z0-9]*@[a-z]*\.([a-z]*)/gi) !== -1
    ? true
    : false
}

export const validateInputPasswordValue = (value) => {
  if (!value.length) return false

  return value.length >= 8 
    && value.search(/[a-z0-9]*/gi) !== -1
    ? true
    : false
}