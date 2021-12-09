import { useContext } from 'react';
import { Context } from './StoreProvider';

const useSelector = (paths: string[] = []) => {
  const { state } = useContext(Context);

  return paths.length === 0
    ? state
    : [...paths].reduce((acc: any, path: string) => acc[path], state);
};

export default useSelector;
