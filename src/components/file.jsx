import React from "react";
import axios from "axios";

const UplaodFile = () => {
  const [file, setFile] = React.useState();
  const [uploaded, setUploaded] = React.useState(false);
  const [error, setError] = React.useState("");

  const changeHandler = (event) => {
    if (uploaded) {
      setUploaded(false);
    }
    if (error.length > 0) {
      setError("");
    }
    setFile(event.target.files[0]);
  };

  const fileToBlob = async (f) =>
    new Blob([new Uint8Array(await f.arrayBuffer())], { type: f.type });

  const uploadToPreSignedUrl = async (url, blob) => {
    try {
      const resp = await axios.put(url, blob, {
        headers: {
          "content-type": "image/png",
          accept: "*/*",
          "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        },
      });
      if (resp.status === 200) {
        return true;
      }
    } catch (err) {
      console.log("error", err);
      return false;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("please select file first");
      return;
    }
    try {
      const response = await axios.post(
        "https://api-test.testwise.io/test_upload_file",
        {
          content_type: "image/png",
        }
      );
      console.log("resp", response.data);
      if (response.data.id) {
        const { upload_url } = response.data;
        if (upload_url) {
          const blob = await fileToBlob(file);
          const resp = await uploadToPreSignedUrl(upload_url, blob);
          if (resp === true) {
            setUploaded(true);
          } else {
            setError(`Unable to upload file`);
          }
        } else {
          setError("Unable to get presigned url");
        }
      } else {
        setError("Unable to get presigned url");
      }
    } catch (err) {
      setError("Unable to get presigned url");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h1>Gcp File Uploader</h1>
      <input
        accept="image/*"
        id="contained-button-file"
        type="file"
        onChange={changeHandler}
      />
      <div style={{ width: 100 }}>
        <label htmlFor="contained-button-file">
          <button style={{ padding: 10 }} onClick={onSubmit}>
            Submit
          </button>
        </label>
      </div>
      {uploaded && (
        <p style={{ color: "green", margintop: 10 }}>Successfully Uploaded</p>
      )}
      {error.length > 0 && (
        <p style={{ color: "red", margintop: 10 }}>{error}</p>
      )}
    </div>
  );
};

export default UplaodFile;
