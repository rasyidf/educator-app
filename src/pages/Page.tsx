import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { Player } from '@lottiefiles/react-lottie-player'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { SupabaseAuthService } from '../services/supabase.auth.service'

import { Link } from 'react-router-dom'
import { SupabaseDataService } from '../services/supabase.data.service'
import './Page.scss'
const sbDataService = new SupabaseDataService()
const supabaseAuthService = new SupabaseAuthService()
// let _user: User | null = null
const nameToHeader: Record<string, string> = {
  rpp: 'Rencana Pelaksanaan Pembelajaran',
  material: 'Materi Ajar',
  evaluasi: 'Alat Evaluasi',
  media: 'Media Ajar'
}

const Page: React.FC = () => {
  const [courseList, setCourseList] = useState<any[]>([])
  // useEffect(() => {
  //   // Only run this one time!  No multiple subscriptions!
  //   supabaseAuthService.user.subscribe((user: User | null) => {
  //     _user = user
  //   })
  // }, [])

  useEffect(() => {
    void sbDataService.getRows('courses').then((data) => {
      if (data != null) {
        setCourseList(data)
      }
    })
  }, [])

  const { name } = useParams<{ name: string }>()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{nameToHeader[name]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {
          courseList.length > 0
            ? courseList.map((course) => {
              return (
                <Link key={course.id} to={`/subcourse/${name}/${course.id as string}`}>
                  <div className="course-card">
                    <div className="course-card-image">
                      {course.course_image && <img src={course.course_image} alt={course.course_name} />}
                    </div>
                    <div className="course-card-content">
                      <h1>{course.course_name}</h1>
                      <p>{course.course_description}</p>
                    </div>
                  </div>
                </Link>
              )
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
  )
}

export default Page
