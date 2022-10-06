import { useEffect, useState } from "react";
import { useParams } from "react-router";

const ProductPage = () => {

  const [subject, setSubject] = useState<any>({});
  const [course, setCourse] = useState<any>({});


  const { id, prodId, name } = useParams<{ id: string, prodId: string, name: string; }>();

  useEffect(() => {
    console.log("id", id);
    console.log("prodId", prodId);
    console.log("name", name);
    // void sbDataService.getFilterRow('courses', 'id', id).then((data) => {
    //   if (data?.data) {
    //     setCourse(data?.data)
    //   }
    // })
    // void sbDataService.getFilterRows('subcourse', 'course_id', id).then((data) => {
    //   if ((data?.data) != null) {
    //     setCourseList(data?.data)
    //   }
    // })
  }, [id]);

  return (
    <div>ProductPage</div>
  );
};

export default ProductPage;
