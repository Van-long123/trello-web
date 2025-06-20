export const capitalizeFirstLetter = (val) => {
  if (!val) return 'null'
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}