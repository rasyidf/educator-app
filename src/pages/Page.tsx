import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { SupabaseAuthService } from '../Login/supabase.auth.service';
import { Provider, User } from '@supabase/supabase-js';
import { useEffect } from 'react';
const supabaseAuthService = new SupabaseAuthService();
let _user: User | null = null;
const Page: React.FC = () => {
  useEffect(() => {
    // Only run this one time!  No multiple subscriptions!
    supabaseAuthService.user.subscribe((user: User | null) => {
      _user = user;
    });
  }, []);


  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
