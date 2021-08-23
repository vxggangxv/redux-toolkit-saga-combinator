import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from 'store/modules';

const sagaMiddleware = createSagaMiddleware();
let middlewares = [sagaMiddleware];

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
const enhancers = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(rootReducer, enhancers);
sagaMiddleware.run(rootSaga);

export default store;
