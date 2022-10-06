import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { SupabaseAuthService } from '../services/supabase.auth.service';

import { Link } from 'react-router-dom';
import { SupabaseDataService } from '../services/supabase.data.service';
import './SubjectPage.scss';
const sbDataService = new SupabaseDataService();
const supabaseAuthService = new SupabaseAuthService();
const nameToHeader: Record<string, string> = {
  rpp: 'Rencana Pelaksanaan Pembelajaran',
  material: 'Materi Ajar',
  evaluasi: 'Alat Evaluasi',
  media: 'Media Ajar'
}
const Page: React.FC = () => {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [parentcourse, setCourse] = useState<any>({});
  useEffect(() => {
    // Only run this one time!  No multiple subscriptions!
    // supabaseAuthService.user.subscribe((user: User | null) => {
    //   _user = user
    // })
  }, []);

  const { id, names } = useParams<{ id: string; names: string; }>();

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
                <a key={course.id} href={buildWhatsappBot(parentcourse, course, names)}>
                  <div className="course-card">
                    <div className="course-card-image">
                      {course.subcourse_image && <img src={course.course_image} alt={course.course_name} />}
                    </div>
                    <div className="course-card-content">
                      <h1>{course.subcourse_name}</h1>
                      <p>{course.subcourse_description}</p>
                      <h3>{course.subcourse_price}</h3>
                    </div>
                  </div>
                </a>
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

function buildWhatsappBot(parentcourse: any, course: any, name:string): string | undefined {
  const url = 'https://wa.me/6285330121887?text=';
  const message = `Halo, saya tertarik dengan produk ${nameToHeader[name]} ${course.subcourse_name} di ${parentcourse.course_name} dengan harga ${course.subcourse_price}.`;
  return url + encodeURIComponent(message);
}

export default Page;
