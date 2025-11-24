import { useEffect, useState } from 'react'

/**
 * useDebouncedValue - 간단한 디바운스 훅
 *
 * 입력값 변화가 멈춘 뒤 delay(ms) 만큼 지난 후 값을 업데이트합니다.
 * 실시간 검색처럼 호출 비용이 큰 작업을 완화할 때 사용합니다.
 */
export const useDebouncedValue = <T>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}
