import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import './imageCropper.scss';

interface imageCropperProps{
    width:number;
    height:number;
    aspect:number;
    image:any;
    submitImage:(image:string) => void;
}

const ImageCropper:React.FC<imageCropperProps> = ({width, height, aspect, image, submitImage}):JSX.Element => {
  const [croppedImage, setCroppedImage] = useState<string>();

  const handleSubmit = () => {
    if(croppedImage !== undefined && croppedImage !== null){
      submitImage(croppedImage);
    }
  }

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    setCroppedImage(cropper?.getCroppedCanvas().toDataURL());
  };
  

  return(
    <div className='image-cropper-container'>
      {/* <ReactCrop className='image-cropper' maxHeight={height} maxWidth={width} aspect={aspect} crop={crop} onChange={c => setCrop(c)}>
        <img src={image} alt=''/>
      </ReactCrop> */}
      <Cropper
        src={image}
        style={{ height: 400, width: "100%" , maxWidth:"40rem"}}
        // Cropper.js options
        initialAspectRatio={1}
        aspectRatio={aspect}
        guides={true}
        crop={onCrop}
        ref={cropperRef}
        background={false}
        minCropBoxHeight={100}
      />
      <button type='button' className='submit-image-btn' onClick={() => handleSubmit()}>
        Add Image
      </button>
    </div>
    
  );
};

export default ImageCropper;
