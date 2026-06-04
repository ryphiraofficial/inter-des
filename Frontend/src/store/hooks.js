// Typed wrappers around useDispatch and useSelector.
// Use these everywhere instead of the raw hooks so that
// when TypeScript is added later, only this file needs updating.
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);
