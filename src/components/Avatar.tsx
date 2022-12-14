import { Camera, CameraResultType } from '@capacitor/camera'
import { IonIcon } from '@ionic/react'
import { person } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { SupabaseStorageService } from '../services/supabase.storage.service'
import './Avatar.scss'

const supabaseStorageService = new SupabaseStorageService()

export function Avatar ({
  url,
  onUpload
}: {
  url: string
  onUpload: (e: any, file: string) => Promise<void>
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()

  useEffect(() => {
    if (url) {
      downloadImage(url)
    }
  }, [url])
  const uploadAvatar = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl
      })

      const file = await fetch(photo?.dataUrl ?? '')
        .then(async (res) => await res.blob())
        .then(
          (blob) =>
            new File([blob], 'my-file', { type: `image/${photo.format}` })
        )

      const fileName = `${Math.random()}-${new Date().getTime()}.${photo.format
        }`
      const { error: uploadError } = await supabaseStorageService.uploadFile('avatars', fileName, file)
      if (uploadError != null) {
        throw uploadError
      }
      onUpload(null, fileName)
    } catch (error) {
      console.log(error)
    }
  }

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabaseStorageService.getFile('avatars', path)
      if (error != null) {
        throw error
      }
      if (!data) {
        return
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error: any) {
      console.log('Error downloading image: ', error.message)
    }
  }

  return (
    <div className="avatar">
      <div className="avatar_wrapper" onClick={uploadAvatar}>
        {avatarUrl
          ? (
            <img src={avatarUrl} alt="avatar" />
            )
          : (
            <IonIcon icon={person} className="no-avatar" />
            )}
      </div>

    </div>
  )
}
