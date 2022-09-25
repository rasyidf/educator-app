import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonPage, IonRouterLink, IonRow, IonToolbar, useIonRouter, useIonToast } from "@ionic/react";
import styles from "./Login.module.scss";

import { arrowBack, bookOutline } from "ionicons/icons";
import CustomField from "../components/CustomField";
import { useLoginFields } from "../data/fields";
import { Action } from "../components/Action";
import { Wave } from "../components/Wave";
import { useEffect, useState } from "react";
import { validateForm } from "../data/utils";
import { useParams } from "react-router";
import { SupabaseAuthService } from '../services/supabase.auth.service';
import { Player } from "@lottiefiles/react-lottie-player";
const supabaseAuthService = new SupabaseAuthService();

const Login = () => {

    const [present, dismiss] = useIonToast();
    const toast = (message: string, color: string = 'danger') => {
        present({
            color: color,
            message: message,
            cssClass: 'toast',
            buttons: [{ icon: 'close', handler: () => dismiss() }],
            duration: 6000,
            onDidDismiss: () => console.log('dismissed'),
            //onWillDismiss: () => console.log('will dismiss'),
        });
    };

    const params = useParams();
    const router = useIonRouter();
    const fields = useLoginFields();
    const [errors, setErrors] = useState<Record<string, any> | boolean>(false);
    const signInWithEmail = async (email: string, password: string) => {
        const { user, session, error } =
            await supabaseAuthService.signInWithEmail(email, password);
        if (error) { toast(error.message); }
    };
    const login = () => {

        const errors = validateForm(fields);
        setErrors(errors);

        if (!errors.length) {
            const emailField = fields.find(field => field.id === 'email');
            const passwordField = fields.find(field => field.id === 'password');
            signInWithEmail(emailField?.input?.state?.value || "", passwordField?.input?.state?.value || "");
            router.push('/home');
        }
    };

    useEffect(() => {
        return () => {
            fields.forEach(field => field.input.state.reset(""));
            setErrors(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <IonPage className={styles.loginPage}>
            <IonContent fullscreen>
                <IonGrid className="ion-padding">
                    <IonRow>
                        <IonCol size="12" className={styles.headingText}>
                            <Player
                                autoplay
                                src="https://assets3.lottiefiles.com/packages/lf20_4XmSkB.json"
                                style={{ height: '200px', width: '300px' }}
                            >
                            </Player>
                            <IonCardTitle>Masuk</IonCardTitle>
                            <h5>Selamat datang di Educator</h5>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-margin-top ion-padding-top">
                        <IonCol size="12">

                            {fields.map(field => {

                                return <CustomField field={field} errors={errors} />;
                            })}

                            <IonButton expand="block" fill="clear" onClick={login}>Login</IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-margin-top ion-padding-top">
                        <IonCol size="12">
                            <Action message="Belum punya akun?" text="Daftar" link="/signup" />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>

        </IonPage>
    );
};

export default Login;