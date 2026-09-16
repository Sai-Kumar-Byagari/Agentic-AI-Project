import { Provider } from 'react-redux';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { store } from './redux/store';
import App from './App';

export default function Root() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  );
}
