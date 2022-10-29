import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonSearchbar, IonText, IonThumbnail, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
// import { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import materi from '../assets/bahanrion.png';
import rpp from '../assets/book.jpg';
import evals from '../assets/evaluasion.png';
import mediaajar from '../assets/komputerion.png';
import logo from '../assets/nos.jpg';
import SDImg from '../assets/SD.png';
import SMPImg from '../assets/SMP.png';
import SMAImg from '../assets/SMA.png';
import { SupabaseAuthService } from '../services/supabase.auth.service';
import './Home.scss';

import styles from './Home.module.scss';
import { personCircle, searchSharp } from 'ionicons/icons';
import { User } from '@supabase/gotrue-js';
import { roleToString, stringToRole } from './roleToString';
const supabaseAuthService = new SupabaseAuthService();

const HomePage: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  let _user: User | null = null;
  function dismiss() {
    modal.current?.dismiss();
  }
  const [role, setRole] = useState('');
  const router = useHistory();
  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
    user_role: ''
  });
  useEffect(() => {
    // Only run this one time!  No multiple subscriptions!
    supabaseAuthService.user.subscribe((user: User | null) => {

      _user = user;
      if (_user?.id) {
        supabaseAuthService.getProfile().then(({ data, error }) => {
          if (error) {
            console.log(error);
          }
          setProfile({ ...data, user_role: roleToString[data?.user_role] });
          setRole(roleToString[data.user_role]);
          console.log(data);
          if (data && data?.user_role === '') {
            // log to console
            console.log('user role is empty', data?.user_role);
            modal.current?.present();
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    });
  }, []); // <-- empty dependency array



  // update profile user_role then dismiss modal
  const changeRole = useCallback(async (role: string) => {
    void supabaseAuthService.updateProfile({ user_role: role }).then(
      (data) => {
        if (data != null) {
          setProfile({ ...data, user_role: stringToRole[data?.user_role] });
          setRole(data?.user_role);
          dismiss();
        }
      }
    );
  }, []);


  return (
    <IonPage>

      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className={styles.Header}>
          <IonImg src={logo} alt="logo" className={styles.image} />
          <h1>Educator</h1>
        </div>
        <IonText onClick={() => modal.current?.present()}>
          <h2 className={styles.pengunjung}>Hallo {profile?.username || "Pengunjung"}</h2>
          <p className={styles.role}>Anda masuk sebagai {role || "guest"}</p>
        </IonText>
        <IonSearchbar disabled className='custom' show-clear-button="focus" searchIcon={searchSharp} placeholder="Cari" animated></IonSearchbar>

        <IonGrid fixed className={styles.mainGrid}>
          <IonRow>
            <IonCol>
              <IonCard routerLink="/course/media">
                <IonCardHeader>
                  <img src={mediaajar} alt="media" width={128} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>Media Ajar</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink="/course/evaluasi">
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
              <IonCard routerLink="/course/rpp">
                <IonCardHeader>
                  <img src={rpp} alt="rpp" width={128} />
                </IonCardHeader>
                <IonCardContent>
                  <h1>RPP</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink="/course/material">
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
        <IonModal id="change-role-modal" ref={modal} trigger="open-custom-dialog">
          <div className="wrapper">
            <h1>Jenjang Pendidikan</h1>
            <p>Anda belum memilih jenjang pendidikan, silahkan pilih salah satu</p>

            <IonList lines="none">
              <IonItem button detail={false} onClick={() => changeRole("1")}>
                <IonImg src={SDImg} slot="start" />
                <IonLabel>Sekolah Dasar</IonLabel>
              </IonItem>
              <IonItem button detail={false} onClick={() => changeRole("2")}>
                <IonImg src={SMPImg} slot="start" />
                <IonLabel>Sekolah Menengah Pertama</IonLabel>
              </IonItem>
              <IonItem button detail={false} onClick={() => changeRole("3")}>
                <IonImg src={SMAImg} slot="start" />
                <IonLabel>Sekolah Menengah Atas</IonLabel>
              </IonItem>
            </IonList>

            <p>Untuk mengubah jenjang pendidikan anda dapat menghubungi administrator</p>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
