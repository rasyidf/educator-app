import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, span, IonPage, IonGrid, IonCol, IonRow, IonImg, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { SupabaseDataService } from "../services/supabase.data.service";
import styles from "./ProductPage.module.css";

const sbDataService = new SupabaseDataService();
const ProductPage = () => {

  const [subject, setSubject] = useState<any>({});
  const [course, setCourse] = useState<any>({});
  const [product, setProduct] = useState<any>({});


  const { id, name: names, subjectId } = useParams<{ id: string; name: string; subjectId: string; }>();


  useEffect(() => {
    console.log("id", id);
    console.log("prodId", subjectId);
    console.log("name", names);
    void sbDataService.getFilterRow("courses", "id", id).then((data) => {
      if (data?.data) {
        setCourse(data?.data);
      }
    });
    void sbDataService.getFilterRow("subcourse", "id", subjectId).then((data) => {
      if (data?.data) {
        setSubject(data?.data);
      }
    });

    void sbDataService.getFilterRows("products", "subcourse_id", subjectId).then((data) => {
      console.log(data);
      if (data?.data) {
        // find product by category name
        const prod = data?.data?.find((prods: any) => (prods.product_type as string).toUpperCase() === names.toUpperCase());
        setProduct(prod);
      }
    });
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <span className={styles.title}>
                    Produk
                  </span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <span className={styles.details}><b>Materi:</b> {course.course_name}</span><br />
                  <span className={styles.details}><b>Tema  :</b> {subject.subcourse_name}</span><br />
                  <span className={styles.details}><b>Jenis Berkas:</b> {product.product_type}</span>

                </IonCol>
                <IonCol size="6">
                  <span className={styles.price}>Rp. {formatCurrency(product.product_price)}</span>
                </IonCol>
              </IonRow>
            </IonGrid>


          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>
            <h4>Deskripsi</h4>
            <p>{product.product_description}</p>
          </IonCardContent>

        </IonCard>
        <IonCard>
          <IonCardContent>
            <h4>Preview</h4>
            <IonImg src={product.product_preview} />
          </IonCardContent>
        </IonCard>
        {/* Ionic Floating Button with label: Beli */}
        <div className={styles.fab}>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton target="_black" color="primary" href={buildWhatsappBot(product, course, subject)}>
              Beli
            </IonFabButton>
          </IonFab>
        </div>
      </IonContent>
    </IonPage>
  );
};

// convert number to currency format (IDR)
function formatCurrency(num: string): string;
function formatCurrency(num: number): string;
function formatCurrency(num: any): string {
  const formatter = /(\d)(?=(\d{3})+(?!\d))/g;
  // null check
  if (num === null || num === undefined) {
    return "0";
  }

  if (num instanceof Number) {
    return num.toString().replace(formatter, "$1.");
  } else {
    return num.replace(formatter, "$1.");
  }
};

//href={buildWhatsappBot(parentcourse, course, names)}
function buildWhatsappBot(product: product, course: course, subcourse: subcourse): string | undefined {
  const url = 'https://wa.me/6281215308292?text=';
  const message = `Halo, Saya tertarik dengan produk ${product.product_type}\n` +
    `Materi: ${subcourse.subcourse_name} \n Mapel: ${course.course_name}\n Harga: Rp. ${formatCurrency(product.product_price)}.`;
  return url + encodeURIComponent(message);
}
type product = {
  product_file: string;
  product_preview: string;
  product_name: string;
  product_price: string;
  product_type: string;
  subcourse_id: string;
};
type course = {
  course_name: string;
};

type subcourse = {
  subcourse_name: string;
};
export default ProductPage;
