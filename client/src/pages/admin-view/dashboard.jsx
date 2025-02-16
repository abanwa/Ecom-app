import { useEffect, useState } from "react";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImage, getFeatureImages } from "../../store/common-slice";
import { useToast } from "@/hooks/use-toast";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((state) => state?.commonFeature);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      console.log("add feature image response  : ", data);
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: "feature image added successfully"
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive"
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log("featureImageList : ", featureImageList);

  return (
    <div>
      <h1>Upload Feature Images</h1>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
        // isEditMode={currentEditedId !== null}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative" key={featureImgItem?._id}>
                <img
                  src={featureImgItem?.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                  alt={featureImgItem?._id}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
