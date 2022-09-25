import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { SupabaseAuthService } from '../services/supabase.auth.service';
import { Player } from "@lottiefiles/react-lottie-player";

import './Page.css';
const supabaseAuthService = new SupabaseAuthService();
let _user: User | null = null;
const nameToHeader: Record<string, string> = {
  'rpp': 'Rencana Pelaksanaan Pembelajaran',
  'material': 'Materi Ajar',
  'evaluasi': 'Alat Evaluasi',
  'media': 'Media Ajar',
};

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
          <IonTitle>{nameToHeader[name]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding"> 
          <Player
            autoplay
            loop
            src="https://assets7.lottiefiles.com/packages/lf20_eJkC1J.json"
            style={{ height: '400px', width: '400px' }}
          >
          </Player>
          <h1 className="text-center font-sans text-xl font-bold">BELUM ADA DATA</h1>
      </IonContent>
    </IonPage>
  );
};

export default Page;
