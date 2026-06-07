import { ref, type Ref } from 'vue'

export interface CrudState<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
}

export interface CrudMethods<T extends { _id?: string }> {
  list: () => Promise<T[]>
  get: (id: string) => Promise<T>
  create: (payload: Omit<T, '_id'>) => Promise<T>
  update: (id: string, payload: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
  save: (item: T | Omit<T, '_id'>) => Promise<T>
}

export type UseCrudReturn<T extends { _id?: string }> = CrudState<T> & CrudMethods<T>

export function useCrud<T extends { _id?: string }> (
  url: string,
  resource: string,
): UseCrudReturn<T> {
  const data = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const error = ref<string | null>(null)

  const baseUrl = `${url}/${resource}`

  async function handleResponse (res: Response): Promise<any> {
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`CRUD error (${res.status}): ${text}`)
    }
    if (res.status === 204) {
      return undefined
    }
    return res.json()
  }

  async function list (): Promise<T[]> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(baseUrl)
      const items = await handleResponse(res) as T[]
      data.value = items
      return items
    } catch (error_: any) {
      error.value = error_.message
      throw error_
    } finally {
      loading.value = false
    }
  }

  async function get (id: string): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${baseUrl}/${id}`)
      return await handleResponse(res) as T
    } catch (error_: any) {
      error.value = error_.message
      throw error_
    } finally {
      loading.value = false
    }
  }

  async function create (payload: Omit<T, '_id'>): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const item = await handleResponse(res) as T
      data.value = [...data.value, item]
      return item
    } catch (error_: any) {
      error.value = error_.message
      throw error_
    } finally {
      loading.value = false
    }
  }

  async function update (id: string, payload: Partial<T>): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const item = await handleResponse(res) as T
      data.value = data.value.map(i => (i as any)._id === id ? item : i)
      return item
    } catch (error_: any) {
      error.value = error_.message
      throw error_
    } finally {
      loading.value = false
    }
  }

  async function remove (id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
      data.value = data.value.filter(i => (i as any)._id !== id)
    } catch (error_: any) {
      error.value = error_.message
      throw error_
    } finally {
      loading.value = false
    }
  }

  async function save (item: T | Omit<T, '_id'>): Promise<T> {
    if ((item as T)._id) {
      return update((item as T)._id!, item as Partial<T>)
    }
    return create(item as Omit<T, '_id'>)
  }

  return { data, loading, error, list, get, create, update, remove, save }
}
