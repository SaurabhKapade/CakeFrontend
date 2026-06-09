import { configureStore } from "@reduxjs/toolkit";
import CakeSliceReducer from "./Slices/CakeSlice";
import BouquetSliceReducer from "./Slices/BouquetSlice";
import SearchSliceReducer from "./Slices/SearchSlice";
import AuthSliceReducer from "./Slices/AuthSlice";
import UserAuthSliceReducer from "./Slices/UserAuthSlice";
import OrderSliceReducer from "./Slices/OrderSlice";

export const store = configureStore({
  reducer: {
    cake: CakeSliceReducer,
    bouquet: BouquetSliceReducer,
    search: SearchSliceReducer,
    auth: AuthSliceReducer,
    userAuth: UserAuthSliceReducer,
    order: OrderSliceReducer,
  },
});
