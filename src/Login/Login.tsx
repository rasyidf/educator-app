import {
    IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid,
    IonHeader, IonIcon, IonInput, IonLabel, IonMenuButton, IonPage, IonRow,
    IonTitle, IonToolbar, useIonToast
} from '@ionic/react';
import { link, logIn, personAdd, refreshCircle } from 'ionicons/icons';
import { useState } from 'react';
import './Login.css';


import ProviderSignInButton from './ProviderSignInButton';
import { SupabaseAuthService } from './supabase.auth.service';
import { validateEmail } from './validateEmail';
const supabaseAuthService = new SupabaseAuthService();

const Login: React.FC = () => {
    const [present, dismiss] = useIonToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = (message: string, color: string = 'danger') => {
        present({
            color: color,
            message: message,
            cssClass: 'toast',
            buttons: [{ icon: 'close', handler: () => dismiss() }],
            duration: 6000,
            //onDidDismiss: () => console.log('dismissed'),
            //onWillDismiss: () => console.log('will dismiss'),
        });
    };
    const signInWithEmail = async () => {
        const { user, session, error } =
            await supabaseAuthService.signInWithEmail(email, password);
        if (error) { toast(error.message); }
    };
    const signUp = async () => {
        const { user, session, error } =
            await supabaseAuthService.signUpWithEmail(email, password);
        if (error) { toast(error.message); }
        else { toast('Please check your email for a confirmation link', 'success'); }
    };
    const resetPassword = async () => {
        const { data, error } =
            await supabaseAuthService.resetPassword(email);
        if (error) { toast(error.message); }
        else { toast('Please check your email for a password reset link', 'success'); }
    };
    const sendMagicLink = async () => {
        const { user, session, error } =
            await supabaseAuthService.sendMagicLink(email);
        if (error) { toast(error.message); }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/page" />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Login Page</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonGrid class="ion-padding">
                    <IonRow>
                        <IonCol>
                            <IonLabel><b>Email</b></IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput type="email"
                                placeholder="Enter your email"
                                onIonChange={e => setEmail(e.detail.value!)}
                                value={email} class="inputBox" />
                        </IonCol>
                    </IonRow>
                    {!validateEmail(email) && email.length > 0 &&
                        <IonRow>
                            <IonCol>
                                <IonLabel color="danger"><b>Invalid email format</b></IonLabel>
                            </IonCol>
                        </IonRow>
                    }
                    <IonRow>
                        <IonCol>
                            <IonLabel><b>Password</b></IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput type="password"
                                placeholder="Enter your password"
                                onIonChange={e => setPassword(e.detail.value!)}
                                value={password} class="inputBox" />
                        </IonCol>
                    </IonRow>
                    {password.length > 0 && password.length < 6 &&
                        <IonRow>
                            <IonCol>
                                <IonLabel color="danger"><b>Password too short</b></IonLabel>
                            </IonCol>
                        </IonRow>
                    }
                    <IonRow>
                        <IonCol>
                            <IonButton expand="block"
                                disabled={!validateEmail(email) || password.length < 6}
                                onClick={signInWithEmail}>
                                <IonIcon icon={logIn} size="large" />&nbsp;&nbsp;
                                <b>Masuk</b>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton expand="block"
                                disabled={!validateEmail(email) || password.length < 6}
                                onClick={signUp}>
                                <IonIcon icon={personAdd} size="large" />&nbsp;&nbsp;
                                <b>Daftar</b></IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton expand="block"
                                disabled={!validateEmail(email) || password.length > 0}
                                onClick={resetPassword}>
                                <IonIcon icon={refreshCircle} size="large" />&nbsp;&nbsp;
                                <b>Lupa Password</b></IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonRow>
                    <IonCol class="ion-text-center">
                        <IonLabel><b>Sign in with:</b></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <ProviderSignInButton name="google" />
                    </IonCol>
                </IonRow>
             


            </IonContent>
        </IonPage>
    );
};

export default Login;
