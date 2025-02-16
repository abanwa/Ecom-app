import { useCallback, useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(e) {
    e.preventDefault();
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage(e) {
    e.preventDefault();
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // this will return the image url result
  const uploadImageToCloudinary = useCallback(async () => {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/upload-image",
      data
    );
    console.log("uploadImageToCloudinary response : ", response);
    if (response?.data?.success) {
      setImageLoadingState(false);
      setUploadedImageUrl(response?.data?.result?.url);
    }
  }, [imageFile, setImageLoadingState, setUploadedImageUrl]);

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile, uploadImageToCloudinary]);

  return (
    <div
      className={`w-full mt-4 ${isCustomStyling ? "" : " max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          type="file"
          id="image-upload"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disable={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{imageFile?.name}</p>
            <Button
              onClick={handleRemoveImage}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
