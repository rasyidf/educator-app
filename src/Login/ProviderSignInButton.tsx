import { IonButton, IonIcon } from '@ionic/react'
import { Provider } from '@supabase/gotrue-js'
import { addIcons } from 'ionicons'
import { logoGoogle } from 'ionicons/icons'
import { SupabaseAuthService } from '../services/supabase.auth.service'
import './ProviderSignInButton.scss'

interface ContainerProps {
  name: string
}

const supabaseAuthService = new SupabaseAuthService()
const signInWithProvider = async (provider: Provider) => {
  console.log('signInWithProvider', provider)
  const { user, session, error } =
    await supabaseAuthService.signInWithProvider(provider)
  console.log('user', user)
  console.log('session', session)
  console.log('error', error)
  return { user, session, error }
}
addIcons({
  google: logoGoogle
})

interface ProviderProps {
  name: string
}

const ProviderSignInButton: React.FC<ContainerProps> = ({ name }: ProviderProps) => {
  const nameProperCase = name.charAt(0).toUpperCase() + name.slice(1)
  return (
    <div className="ion-text-center" onClick={() => { signInWithProvider((name as Provider)) }}>
      <IonButton>
        <IonIcon icon={name} size="sm" />
      </IonButton><br />
      <b>{nameProperCase}</b>
    </div>
  )
}

export default ProviderSignInButton
