import { ref } from 'vue'
import type { Ref } from 'vue'

type MakeRef<T extends any[]> = {
  [K in keyof T]: Ref<T[K]>
}

/**
 * 这是一个数据获取函数的配置项
 * @param errMessage 错误信息
 * @param handleErr 错误处理函数
 * @param init 初始化方式
 * @param newData 新数据处理方式
 * @param newDataFunc 新数据处理函数
 */
interface UseFetchDataConfig<T> {
  errMessage: string
  handleErr: (err: any) => void
  init: 'lazy' | 'immediate'
  newData: 'reset' | 'add'
  newDataFunc: (data: Ref<T>, res: T) => void
  afterSuccessFetchData: (data: Ref<T>) => void
}

/**
 * 这是一个数据获取函数，它可以根据参数获取数据，并根据配置项进行处理
 * @param apiCall 调用的请求函数
 * @param args 请求函数需要的参数
 * @param initialValue 需要获取数据的初始值
 * @param config 各种配置项
 * @returns
 */
export const useFetchData = <P extends any[], T>(
  apiCall: (...args: P) => Promise<T>,
  args: MakeRef<P>,
  initialValue: T,
  config?: Partial<UseFetchDataConfig<T>>,
) => {
  const data = ref<T>(initialValue) as Ref<T>
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const defaultConfig = {
    errMessage: '请求数据失败',
    handleErr: null,
    init: 'lazy',
    newData: 'reset',
    newDataFunc: null,
    afterSuccessFetchData: null,
  }
  /* 获取配置 */
  const finallyConfig = {
    ...defaultConfig,
    ...config,
  }
  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      let argsValue = []
      // 参数不为空
      if (args.length !== 0) {
        argsValue = args.map((item) => item.value) as unknown as P
      } else {
        argsValue = args as P
      }
      // 处理数据添加模式，获取数据
      if (finallyConfig.newData === 'reset') {
        // console.log('reset', argsValue)
        data.value = await apiCall(...argsValue)
      } else if (finallyConfig.newData === 'add') {
        // 如果有处理新数据的函数就使用，不然就使用默认的处理函数
        if (finallyConfig.newDataFunc) {
          const res = await apiCall(...argsValue)
          finallyConfig.newDataFunc(data, res)
        } else {
          console.error('请传入处理新数据的函数')
        }
      }
      // 是否有自定义后续处理函数
      if (finallyConfig.afterSuccessFetchData) {
        finallyConfig.afterSuccessFetchData(data)
      }
    } catch (err) {
      error.value = finallyConfig.errMessage
      console.error(err)
      // 是否有自定义错误处理函数
      if (finallyConfig.handleErr) {
        finallyConfig.handleErr(err)
      }
    } finally {
      loading.value = false
    }
  }
  // 初始化时是否立即请求数据
  if (finallyConfig.init === 'immediate') {
    fetchData()
  }
  return { data, loading, error, fetchData }
}
