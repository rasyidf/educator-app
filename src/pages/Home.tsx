import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
// import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import materi from '../assets/bahanrion.png';
import rpp from '../assets/book.jpg';
import evals from '../assets/evaluasion.png';
import mediaajar from '../assets/komputerion.png';
import logo from '../assets/nos.jpg';
import { SupabaseAuthService } from '../services/supabase.auth.service';
import './Home.scss';

import styles from './Home.module.scss';
const supabaseAuthService = new SupabaseAuthService();

const roleToString: Record<string, string> = {
  0: 'Administrator',
  1: 'Sekolah Dasar',
  2: 'Sekolah Menengah Pertama',
  3: 'Sekolah Menengah Atas'
};
const HomePage: React.FC = () => {
  const [role, setRole] = useState('');
  const router = useHistory();
  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
    user_role: ''
  });
  useIonViewWillEnter(() => {
    void supabaseAuthService.getProfile().then(
      (data) => {
        if (data != null) {
          setProfile({ ...data, user_role: roleToString[data?.user_role] });
          setRole(data?.user_role);
        }
      }
    );
  });

  // useEffect(() => {
  //   if (profile.user_role === '') {
  //     router.push('/login')
  //   }
  // }, [profile, router])

  return (
    <IonPage>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard className={styles.Header}>
          <img src={logo} alt="logo" width={128} style={{ margin: 16 }} />
          <h1>Educator</h1>
        </IonCard>

        <IonCard routerLink="/account">
          <IonCardHeader>
            <h1>Selamat datang {profile.username}</h1>
          </IonCardHeader>
          <IonCardContent>
            <p>Anda Masuk sebagai {role}</p>
          </IonCardContent>
        </IonCard>
        <IonGrid fixed className="main-grid">
          <IonRow>
            <IonCol>
              <IonCard routerLink="/page/media">
                <IonCardHeader>
                  <img src={mediaajar} alt="media" width={128} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>Media Ajar</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink="/page/evaluasi">
                <IonCardHeader>
                  <img src={evals} alt="evaluasi" width={128} />
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
                  <img src={rpp} alt="rpp" width={128} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>RPP</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink="/page/material">
                <IonCardHeader>
                  <img src={materi} alt="materi" width={128} />
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
