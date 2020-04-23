import { createStore, combineReducers, applyMiddleware} from 'redux';
import { createLogger } from 'redux-logger';
import { StorageMiddleware } from 'core/Redux/Middlewares/StorageMiddleware';
import { systemReducer } from 'components/System/SystemReducer';

const rootReducer = combineReducers({
  system: systemReducer,
});

export type RootState = ReturnType<typeof rootReducer>

const store = () => createStore(rootReducer, applyMiddleware(createLogger({ collapsed: true }), StorageMiddleware));

export default store;



