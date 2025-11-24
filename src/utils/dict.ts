export const formatDictField = (arr) => {
  return arr.map(item => ({
    value: item.dictValue,
    label: item.dictLabel,
  }))
}
