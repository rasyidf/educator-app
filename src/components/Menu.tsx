import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  useIonRouter
} from '@ionic/react'

import { User } from '@supabase/supabase-js'
import { archiveOutline, bookOutline, fileTrayOutline, fileTrayStackedOutline, homeOutline, logInOutline, logOutOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SupabaseAuthService } from '../services/supabase.auth.service'
import './Menu.scss'

const supabaseAuthService = new SupabaseAuthService()

interface Appcourse {
  url: string
  iosIcon: string
  mdIcon: string
  title: string
}

const appcourses: Appcourse[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Media Ajar',
    url: '/course/media',
    iosIcon: fileTrayStackedOutline,
    mdIcon: fileTrayStackedOutline
  },
  {
    title: 'Alat Evaluasi',
    url: '/course/evaluasi',
    iosIcon: fileTrayOutline,
    mdIcon: fileTrayOutline
  },
  {
    title: 'RPP',
    url: '/course/rpp',
    iosIcon: bookOutline,
    mdIcon: bookOutline
  },
  {
    title: 'Materi Ajar',
    url: '/course/material',
    iosIcon: archiveOutline,
    mdIcon: archiveOutline
  }
]

const Menu: React.FC = () => {
  const router = useIonRouter()
  const location = useLocation()
  let _user: User | null = null
  const [email, setEmail] = useState('')

  const signOut = async () => {
    const { error } = await supabaseAuthService.signOut()
    if (error != null) {
      console.error('Error signing out', error)
    }
    router.push('/login')
  }

  useEffect(() => {
    // Only run this one time!  No multiple subscriptions!
    supabaseAuthService.user.subscribe((user: User | null) => {
      _user = user
      if (_user?.email) {
        setEmail(_user.email)
      } else {
        setEmail('')
      }
    })
  }, []) // <-- empty dependency array

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Educator</IonListHeader>
          <IonNote>{email}</IonNote>
          {appcourses.map((appcourse, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appcourse.url ? 'selected' : ''} routerLink={appcourse.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appcourse.iosIcon} md={appcourse.mdIcon} />
                  <IonLabel>{appcourse.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}

          {email &&
            <IonButton expand="block" color="white" fill="clear"
              onClick={signOut}>
              <IonIcon icon={logOutOutline} size="large" />&nbsp;&nbsp;
              <b>Logout</b>
            </IonButton>
          }
          {!email &&
            <IonButton expand="block" color="white" fill="clear"
              routerLink="/login">
              <IonIcon icon={logInOutline} size="large" />&nbsp;&nbsp;
              <b>Login</b>
            </IonButton>
          }
        </IonList>

      </IonContent>
    </IonMenu>
  )
}

export default Menu
