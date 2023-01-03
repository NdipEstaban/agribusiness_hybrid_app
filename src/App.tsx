import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';

/* Theme variables */
import './theme/variables.css';

import Main from './pages/main';


import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Notifications from './pages/notifications/notifications';
import Welcome from './pages/welcome/welcome';
import {CreateAccount} from './pages/create_account/create_account';
import Proffession from './pages/proffession/proffession';
import AddPic from './pages/add_profile_pic/add_profile_pic';
import LogIn from './pages/log_in/log_in';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet animated={true}>
        <Redirect exact path='/' to='/new' />
        <Route exact path='/main'>
          <Main />
        </Route>
        <Route exact path='/new'>
          <Welcome />
        </Route>
        <Route exact path='/new/log-in'>
          <LogIn />
        </Route>
        <Route exact path='/new/create-account'>
          <CreateAccount/>
        </Route>
        <Route exact path='/new/create-account/proffession'>
          <Proffession />
        </Route>
        <Route exact path='/new/create-account/add-picture'>
          <AddPic/>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
