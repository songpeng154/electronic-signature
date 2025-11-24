// 字母转'-'分隔形式
export function toKebabCase(str: string) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // 在小写字母或数字和大写字母之间加上 -
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // 在连续大写字母和小写字母之间加上 -
    .toLowerCase() // 转为小写
}
