import type {AppDispatch, RootState} from "./store/store.ts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const useAppDispatch : () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
