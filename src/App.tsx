import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Login from './pages/auth/Login';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './theme/variables.scss';

import ResetPassword from './pages/auth/ResetPassword';
import Signup from './pages/auth/Signup';
import { AccountPage } from './pages/Account';
import HomePage from './pages/Home';
import ProductPage from './pages/ProductPage';
import SubjectPage from './pages/SubjectPage';
import { StartupService } from './services/startup.service';
const startupService = new StartupService()
const startupRoute = startupService.getStartupRoute()
setupIonicReact()

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to={'/home'} />
            </Route>
            <Route path="/home" exact={true}>
              <HomePage />
            </Route>
            <Route path="/page/:name/:id/:prodId" exact={true}>
              <ProductPage />
            </Route>
            <Route path="/page/:name/:id" exact={true}>
              <SubjectPage />
            </Route>
            <Route path="/page/:name" exact={true}>
              <Page />
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/resetpassword/:token" component={ResetPassword} />
            <Route exact path="/account">
              <AccountPage />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
