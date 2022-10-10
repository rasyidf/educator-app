import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage, IonSelect, IonSelectOption, IonTitle,
  IonToolbar,
  useIonLoading, useIonRouter, useIonToast, useIonViewDidEnter, useIonViewWillEnter
} from '@ionic/react';
import { User } from '@supabase/gotrue-js';
import { useCallback, useEffect, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { supabase } from '../services/supabase';
import { SupabaseAuthService } from '../services/supabase.auth.service';
import './Account.scss';
import { roleToString } from './roleToString';
const supabaseAuthService = new SupabaseAuthService();

export function AccountPage() {
  const [present, dismiss] = useIonLoading();
  const [showToast] = useIonToast();
  const [session] = useState(() => supabase.auth.session());
  const router = useIonRouter();
  let _user: User | null = null;

  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
    user_role: ''
  });

  useEffect(() => {

    present({
      message: 'Loading...',
      duration: 1000
    });

    try {
      // Only run this one time!  No multiple subscriptions!
      supabaseAuthService.user.subscribe((user: User | null) => {

        _user = user;
        if (_user?.id) {
          supabaseAuthService.getProfile().then(({ data }) => {
            setProfile({ ...data, user_role: roleToString[data?.user_role] });
          }).catch((err) => {
            console.log(err);
          });
        } else {
          router.push('/login');
        }
      });

    } catch (error: any) {
      showToast({ message: error.message, duration: 5000 });
    } finally {
      dismiss();
    }
  }, []); // <-- empty dependency array



  const updateProfile = useCallback(async (e?: any, avatarUrl = '') => {
    e?.preventDefault();

    present();

    try {
      const user = supabase.auth.user();

      const updates = {
        id: user?.id ?? '',
        ...profile,
        avatar_url: avatarUrl,
        updated_at: new Date()
      };

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal' // Don't return the value after inserting
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      showToast({ message: error.message, duration: 5000 });
    } finally {
      console.log('update end');
      dismiss();
    }
  }, [dismiss, present, profile, showToast]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/', 'forward', 'replace');
  }, [router]);

  useIonViewDidEnter(() => {
    dismiss();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Avatar url={profile.avatar_url} onUpload={updateProfile}></Avatar>
        <form onSubmit={updateProfile} className="profile">
          <IonItem>
            <IonLabel>
              <p>Email</p>
              <p>{session?.user?.email}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Role</IonLabel>
            <IonInput
              type="text"
              name="username"
              readonly
              value={profile.user_role}
              onIonChange={(e) => setProfile({ ...profile, user_role: e.detail.value! })}
            ></IonInput>
            {/* <IonSelect interface="action-sheet" value={profile?.user_role} disabled>
              <IonSelectOption value="1">SD</IonSelectOption>
              <IonSelectOption value="2">SMP</IonSelectOption>
              <IonSelectOption value="3">SMA</IonSelectOption>
              <IonSelectOption value="0">Administrator</IonSelectOption>
            </IonSelect> */}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Nama</IonLabel>
            <IonInput
              type="text"
              name="username"
              value={profile.username}
              onIonChange={(e) =>
                setProfile({ ...profile, username: e.detail.value ?? '' })
              }
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Website</IonLabel>
            <IonInput
              type="url"
              name="website"
              value={profile.website}
              onIonChange={(e) =>
                setProfile({ ...profile, website: e.detail.value ?? '' })
              }
            ></IonInput>
          </IonItem>
          <div className="ion-text-center">
            <IonButton fill="clear" type="submit">
              Update Profile
            </IonButton>
          </div>
        </form>

        <div className="ion-text-center">
          <IonButton fill="clear" onClick={signOut}>
            Log Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
