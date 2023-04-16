// Have fun 🕳️

/**
 * trx
 *
 * db
 *
 * crud -> Create, Read, Update, Delete
 */

export const DB_NAME = 'front_db'
export const STORE_NAME = 'all_message'
export const VER = 1

interface Option {
  isRead?: boolean
}

const connect = (db: IDBDatabase, opt?: Option) => {
  const trx = db.transaction(STORE_NAME, opt?.isRead ? 'readonly' : 'readwrite')
  return trx.objectStore(STORE_NAME)
}

const _o = Object.create(null)

const o = {
  open(h: string, v: number) {
    return new Promise<IDBDatabase>((res, rej) => {
      const req = indexedDB.open(h, v)

      req.onsuccess = () => {
        res(req.result)
      }

      req.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result
        !db.objectStoreNames.contains(STORE_NAME) &&
          db.createObjectStore(STORE_NAME)
      }
    })
  },
  close() {
    this.open(DB_NAME, VER).then((db) => db.close())
  },
  async create(key: string, val: unknown) {
    const db = await this.open(DB_NAME, VER)

    return new Promise<void>((res, rej) => {
      const store = connect(db)

      const req = store.put(val, key)

      req.onsuccess = () => {
        res()
      }
    })
  },
  async read(key: string) {
    const db = await this.open(DB_NAME, VER)

    return new Promise((res, rej) => {
      const store = connect(db, { isRead: true })

      const req = store.get(key)

      req.onsuccess = () => {
        res(req.result)
      }
    })
  },
  async update(key: string, func: (item: unknown) => unknown) {
    const db = await this.open(DB_NAME, VER)

    return new Promise<void>((res, rej) => {
      const store = connect(db)

      const pull = store.get(key)

      pull.onsuccess = () => {
        const prev = pull.result
        const req = store.put(func(prev), key)

        req.onsuccess = () => {
          res()
        }
      }
    })
  },
  async delete(key?: string) {
    const db = await this.open(DB_NAME, VER)

    return new Promise<void>((res, rej) => {
      const store = connect(db)

      const req = key ? store.delete(key) : store.clear()

      req.onsuccess = () => {
        res()
      }
    })
  },
}

export const db = o
