import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Upload',
    path: '/',
    icon: 'Upload',
    component: Home
  }
};

export const routeArray = Object.values(routes);