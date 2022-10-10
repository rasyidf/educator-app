import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { Provider } from '@supabase/gotrue-js';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import { SupabaseAuthService } from '../../services/supabase.auth.service';

interface ContainerProps {
  name: string;
}

const supabaseAuthService = new SupabaseAuthService();
const signInWithProvider = async (provider: Provider) => {
  const { user, session, error } =
    await supabaseAuthService.signInWithProvider(provider);
  return { user, session, error };
};
addIcons({
  google: logoGoogle
});

interface ProviderProps {
  name: string;
}

const ProviderSignInButton: React.FC<ContainerProps> = ({ name }: ProviderProps) => {
  const [present, dismiss] = useIonToast();
  const toast = (message: string, color: string = 'danger') => {
    present({
      color,
      message,
      cssClass: 'toast',
      buttons: [{ icon: 'close', handler: async () => await dismiss() }],
      duration: 6000,
      onDidDismiss: () => console.log('dismissed')
      // onWillDismiss: () => console.log('will dismiss'),
    });
  };
  const nameProperCase = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div className="ion-text-center" onClick={() => { signInWithProvider((name as Provider)); }}>
      <IonButton color={"light"} expand="block"  >
        <IonIcon icon={name} size="sm" style={{paddingRight: "12px"}} />
        <span>Sign in with {nameProperCase}</span> 
      </IonButton><br />
    </div>
  );
};

export default ProviderSignInButton;
