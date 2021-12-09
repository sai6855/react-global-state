import { useContext } from 'react'
import { Context } from './StoreProvider'

const useSetState = () => {
  const { setState } = useContext(Context)

  return setState
}

export default useSetState
