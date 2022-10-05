import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react'
import { User } from '@supabase/supabase-js'
import { Tray } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { SupabaseAuthService } from '../services/supabase.auth.service'
import './Home.scss'
import logo from '../assets/nos.jpg'
import mediaajar from '../assets/komputerion.png'
import evals from '../assets/evaluasion.png'
import rpp from '../assets/book.jpg'
import materi from '../assets/bahanrion.png'
import { useHistory } from 'react-router'

import styles from './Home.module.scss'
const supabaseAuthService = new SupabaseAuthService()
const _user: User | null = null
const nameToHeader: Record<string, string> = {
  rpp: 'Rencana Pelaksanaan Pembelajaran',
  material: 'Materi Ajar',
  evaluasi: 'Alat Evaluasi',
  media: 'Media Ajar'
}
const roleToString: Record<string, string> = {
  0: 'Administrator',
  1: 'Sekolah Dasar',
  2: 'Sekolah Menengah Pertama',
  3: 'Sekolah Menengah Atas'
}
const HomePage: React.FC = () => {
  const [role, setRole] = useState('')
  const router = useHistory()
  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
    user_role: ''
  })
  useIonViewWillEnter(async () => {
    const userProfile = await supabaseAuthService.getProfile()
    if (userProfile?.data) {
      setProfile({ ...userProfile.data, user_role: roleToString[userProfile?.data?.user_role] })
    }
  })

  useEffect(() => {
    if (profile === undefined) {
      router.push('/login')
    }
  }, [profile, router])

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
        {profile?.username && (
          <IonCard routerLink="/account">
            <IonCardHeader>
              <h1>Selamat datang {profile.username}</h1>
            </IonCardHeader>
            <IonCardContent>
              <p>Anda Masuk sebagai {profile.user_role}</p>
            </IonCardContent>
          </IonCard>)
        }
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
  )
}

export default HomePage
