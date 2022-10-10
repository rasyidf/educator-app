import { IonBackButton, IonButton, IonButtons, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonToolbar, useIonToast } from '@ionic/react'
import styles from './Signup.module.scss'

import { arrowBack, bookOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Action } from '../../components/Action'
import CustomField from '../../components/CustomField'
import { useSignupFields } from '../../data/fields'
import { validateForm } from '../../data/utils'
import { SupabaseAuthService } from '../../services/supabase.auth.service'
const supabaseAuthService = new SupabaseAuthService()

const Signup = () => {
  const params = useParams()
  const fields = useSignupFields()
  const [errors, setErrors] = useState<Record<string, any> | boolean>(false)
  const [present, dismiss] = useIonToast()
  const toast = (message: string, color: string = 'danger') => {
    present({
      color,
      message,
      cssClass: 'toast',
      buttons: [{ icon: 'close', handler: async () => await dismiss() }],
      duration: 6000
      // onDidDismiss: () => console.log('dismissed'),
      // onWillDismiss: () => console.log('will dismiss'),
    })
  }

  const signUp = async (email: string, password: string) => {
    const { error } =
      await supabaseAuthService.signUpWithEmail(email, password)
    if (error != null) { toast(error.message) } else { toast('Please check your email for a confirmation link', 'success') }
  }
  const createAccount = () => {
    const errors = validateForm(fields)
    setErrors(errors)

    if (!errors.length) {
      //  Submit your form here
      const emailField = fields.find(field => field.id === 'email')
      const passwordField = fields.find(field => field.id === 'password')
      signUp(emailField?.input?.state?.value ?? '', passwordField?.input?.state?.value ?? '')
    }
  }

  useEffect(() => {
    return () => {
      fields.forEach(field => field.input.state.reset(''))
      setErrors(false)
    }
  }, [params])

  return (
    <IonPage className={styles.signupPage}>
      <IonHeader>
        <IonToolbar>

          <IonButtons slot="start">
            <IonBackButton icon={arrowBack} text="" className="custom-back" />
          </IonButtons>

          <IonButtons slot="end">
            <IonButton className="custom-button">
              <IonIcon icon={bookOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size="12" className={styles.headingText}>
              <IonCardTitle>Daftar</IonCardTitle>
              <h5>Mari bergabung bersama kami</h5>
            </IonCol>
          </IonRow>

          <IonRow className="ion-margin-top ion-padding-top">
            <IonCol size="12">

              {fields.map((field) => {
                return <CustomField key={field.id} field={field} errors={errors} />
              })}

              <IonButton color={"light"} expand="block" onClick={createAccount}>Buat Akun</IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top ion-padding-top">
            <IonCol size="12">
              <Action message="Sudah punya akun?" text="Masuk" link="/login" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

    </IonPage>
  )
}

export default Signup
