import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { SupabaseAuthService } from '../services/supabase.auth.service';

import { Link } from 'react-router-dom';
import { SupabaseDataService } from '../services/supabase.data.service';
import './SubjectPage.scss';
import { roleToString } from './roleToString';
const sbDataService = new SupabaseDataService();
const supabaseAuthService = new SupabaseAuthService();
const nameToHeader: Record<string, string> = {
  rpp: 'Rencana Pelaksanaan Pembelajaran',
  material: 'Materi Ajar',
  evaluasi: 'Alat Evaluasi',
  media: 'Media Ajar'
};
const Page: React.FC = () => {

  let _user: User | null = null;
  const [role, setRole] = useState('');
  const router = useHistory();
  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
    user_role: ''
  });
  const [courseList, setCourseList] = useState<any[]>([]);
  const [parentcourse, setCourse] = useState<any>({});
  useEffect(() => {
    // Only run this one time!  No multiple subscriptions!
    // supabaseAuthService.user.subscribe((user: User | null) => {
    //   _user = user
    // })
  }, []);

  const { id, name: names } = useParams<{ id: string; name: string; }>();

  useEffect(() => {
    void sbDataService.getFilterRow('courses', 'id', id).then((data) => {
      if (data?.data) {
        setCourse(data?.data);
      }
    });
    void sbDataService.getFilterRows('subcourse', 'course_id', id).then((data) => {
      if ((data?.data) != null) {
        setCourseList(data?.data);
      }
    });
  }, [id]);

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
        }).catch((err) => {
          console.log(err);
        });
      } else {
        router.push('/login');
      }
    });
  }, []); // <-- empty dependency array

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{parentcourse.course_name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {
          courseList.length > 0
            ? courseList.map((course) => {

              return (
                <Link key={course.id} to={`/product/${names}/${id}/${course.id}`}>
                  <div className="subcourse-card">
                    <div className="subcourse-card-image">
                      {course.subcourse_image && <img src={course.course_image} alt={course.course_name} />}
                    </div>
                    <div className="subcourse-card-content">
                      <h1>{course.subcourse_name}</h1>
                      <p>{course.subcourse_description}</p>
                      <h3>Rp. {course.subcourse_price}</h3>
                    </div>
                  </div>
                </Link>
              );
            })
            : (<>
              <Player
                autoplay
                loop
                src="https://assets7.lottiefiles.com/packages/lf20_eJkC1J.json"
                style={{ height: '400px', width: '400px' }}
              >
              </Player>
              <h1 className="text-center font-sans text-xl font-bold">BELUM ADA DATA</h1>
            </>)
        }

      </IonContent>
    </IonPage>
  );
};


export default Page;
