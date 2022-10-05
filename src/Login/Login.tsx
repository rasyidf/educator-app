import { IonButton, IonCardTitle, IonCol, IonContent, IonGrid, IonPage, IonRow, useIonRouter, useIonToast } from '@ionic/react'
import styles from './Login.module.scss'

import { Player } from '@lottiefiles/react-lottie-player'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Action } from '../components/Action'
import CustomField from '../components/CustomField'
import { useLoginFields } from '../data/fields'
import { validateForm } from '../data/utils'
import { SupabaseAuthService } from '../services/supabase.auth.service'
const supabaseAuthService = new SupabaseAuthService()

const Login = () => {
  const [present, dismiss] = useIonToast()
  const toast = (message: string, color: string = 'danger') => {
    present({
      color,
      message,
      cssClass: 'toast',
      buttons: [{ icon: 'close', handler: async () => await dismiss() }],
      duration: 6000,
      onDidDismiss: () => console.log('dismissed')
      // onWillDismiss: () => console.log('will dismiss'),
    })
  }

  const params = useParams()
  const router = useIonRouter()
  const fields = useLoginFields()
  const [errors, setErrors] = useState<Record<string, any> | boolean>(false)
  const signInWithEmail = async (email: string, password: string) => {
    const { error } =
            await supabaseAuthService.signInWithEmail(email, password)
    if (error != null) { toast(error.message) }
  }
  const login = () => {
    const errors = validateForm(fields)
    setErrors(errors)

    if (!errors.length) {
      const emailField = fields.find(field => field.id === 'email')
      const passwordField = fields.find(field => field.id === 'password')
      signInWithEmail(emailField?.input?.state?.value ?? '', passwordField?.input?.state?.value ?? '')
      router.push('/home')
    }
  }

  useEffect(() => {
    return () => {
      fields.forEach(field => field.input.state.reset(''))
      setErrors(false)
    }
  }, [params])

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
                              return <CustomField key={field.id} field={field} errors={errors} />
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
  )
}

export default Login
