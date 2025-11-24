import { Persist } from 'sard-uniapp'

const persist = new Persist('surge')

// 创建持久存储
export const createPersist = <T> (key: string) => {
  return {
    set(value: T) {
      persist.set(key, value)
    },
    get() {
      return persist.get(key)
    },
    remove() {
      persist.remove(key)
    },
  }
}
