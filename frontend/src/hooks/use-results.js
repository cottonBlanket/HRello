import {useSelector} from 'react-redux';

export function useResults() {
  return useSelector((state) => state.results);
}
