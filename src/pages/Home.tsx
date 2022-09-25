import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { fileTrayStackedOutline } from 'ionicons/icons';
import { useState } from 'react';
import { SupabaseAuthService } from '../services/supabase.auth.service';
import { Tray } from "phosphor-react";
import './Home.scss';
const supabaseAuthService = new SupabaseAuthService();
let _user: User | null = null;
const nameToHeader: Record<string, string> = {
  'rpp': 'Rencana Pelaksanaan Pembelajaran',
  'material': 'Materi Ajar',
  'evaluasi': 'Alat Evaluasi',
  'media': 'Media Ajar',
};
const roleToString: Record<string, string> = {
  '0': "Administrator",
  '1': "Sekolah Dasar",
  '2': "Sekolah Menengah Pertama",
  '3': "Sekolah Menengah Atas",
};
const HomePage: React.FC = () => {
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
    user_role: '',
  });
  useIonViewWillEnter(async () => {

    const userProfile = await supabaseAuthService.getProfile();
    if (userProfile?.data) {
      setProfile({ ...userProfile.data, user_role: roleToString[userProfile?.data?.user_role] });
    }
  });


  return (
    <IonPage>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard routerLink="/account">
          <IonCardHeader>
            <h1>Selamat datang {profile.username}</h1>
          </IonCardHeader>
          <IonCardContent>
            <p>Anda Masuk sebagai {profile.user_role}</p>
          </IonCardContent>
        </IonCard>

        <IonGrid fixed className="main-grid">
          {/* 2x2 Row Col with Action Buton with icon  */}
          <IonRow>
            <IonCol>
              <IonCard routerLink="/page/media">
                <IonCardHeader>
                  <Tray weight='duotone' size={64} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>Media Ajar</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink="/page/evaluasi">
                <IonCardHeader>
                  <Tray weight='duotone' size={64} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>Alat Evaluasi</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard routerLink="/page/rpp">
                <IonCardHeader>
                  <Tray weight='duotone' size={64} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>RPP</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink="/page/material">
                <IonCardHeader>
                  <Tray weight='duotone' size={64} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>Materi Ajar</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
