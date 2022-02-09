import React, { useState } from "react";

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <h1>Upload Image to detect</h1>
      {selectedImage && (
        <div>
        <img id="img" alt="Not Found" width={"500px"} src={URL.createObjectURL(selectedImage)} />
        <br />
        <button style={{zIndex: "20"}} onClick={()=>setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />
      <br /> 
      <input style={{zIndex: "20"}}
        type="file"
        name="myImg"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );

};

export default UploadAndDisplayImage;