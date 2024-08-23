import React, { useState } from 'react';
import './ButtonStyles.css'
import './ImageUploader.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Stack } from 'react-bootstrap';
import { isDisabled } from '@testing-library/user-event/dist/utils';
const completedUpload = async (count, tripId) => {
    try {
        const body = JSON.stringify({
            trip_uuid: tripId,
            media_selection: count,
        });

        const res = await fetch(
            'https://ykd6nisbx2mztvsvckbtsp6r640yqmwv.lambda-url.us-east-2.on.aws/',
            {
                method: 'POST',
                body: body,
            }
        );
        if (res.ok) {
            const data = await res.json();
            console.log('completedUpload Success response:', JSON.stringify(data));
            return { success: true, data: data };
        } else {
            const errorData = await res.json();
            console.error(
                'completedUpload Error response:',
                JSON.stringify(errorData)
            );
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('Error in completedUpload:', error);
        return { success: false, error };
    }
}
const ImageUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [textarea, setTextarea] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const getUploadUrls = async (images, tripId) => {
        console.log('getUploadUrl called with tripId:', tripId);
        console.log('Number of images:', images.length);
        var imagenames = []
        var images = []
        // var imagepath = URL.createObjectURL(images[0])
        for (let index = 0; index < selectedFiles.length; index++) {
            const element = selectedFiles[index];
            images.push({
                uri: element.name,
                mime: element.type
            })

        }
        const body = JSON.stringify({
            trip_uuid: tripId,
            images: images

        });
        const res = await fetch(
            // 'https://2x326nvgve.execute-api.us-east-2.amazonaws.com/prod/api/v1/report/media/upload',
            'https://lqf5gbhpny3x2bb3rovip3wt2u0hlbzz.lambda-url.us-east-2.on.aws/',
            {
                method: 'POST',
                body: body,
            }
        );


        if (res.ok) {
            const data = await res.json();

            return data;
        } else {
            console.error('getUploadUrl Error response:', await res.text());
            return [];
        }
    }
    const uploadImagesToS3 = async (images, tripId) => {
        const uploadUrlData = await getUploadUrls(images, tripId);
        const uploadPromises = uploadUrlData.map((p, index) => {
            var image = selectedFiles[index]
            return sendImageToS3(image, p, index);
        })

        const results = await Promise.all(uploadPromises);
        console.log('All uploads completed. Results:', results);
        return true;
        // if (uploadUrlData && uploadUrlData.length > 0) {
        //     const uploadPromises = images.map(async (image, idx) => {

        //         const imageName = image.name;

        //         const uploadUrl = uploadUrlData[idx];

        //         const response = await fetch(uploadUrl.url, {
        //             method: 'PUT',
        //             body: image,
        //             headers: {
        //                 'Content-Type': image.type,
        //             },
        //         });

        //         if (!response.ok) {
        //             console.error(`Error uploading ${imageName}:`, await response.text());
        //         }
        //     });

        //     await Promise.all(uploadPromises);
        // }
    };
    const sendImageToS3 = async (
        image,
        preSignedUrl, index
    ) => {
        const formData = new FormData();

        let filename = image.name;
        const file = {
            uri: image.url,
            type: "image/png",
            name: filename,
        };
        formData.append('Policy', preSignedUrl.fields.Policy);
        formData.append('X-Amz-Algorithm', preSignedUrl.fields['X-Amz-Algorithm']);
        formData.append('X-Amz-Credential', preSignedUrl.fields['X-Amz-Credential']);
        formData.append('X-Amz-Date', preSignedUrl.fields['X-Amz-Date']);
        formData.append('X-Amz-Signature', preSignedUrl.fields['X-Amz-Signature']);
        formData.append(
            'X-Amz-Security-Token',
            preSignedUrl.fields['X-Amz-Security-Token'],
        );
        formData.append('key', preSignedUrl.key);
        formData.append('bucket', preSignedUrl.fields.bucket);
        formData.append('Content-Type', "image/png");

        formData.append('file', selectedFiles[index]);


        const fetchOptions = {
            method: 'POST',
            body: formData,

        };

        return fetch(preSignedUrl.url, fetchOptions)
            .then(res => {
                console.log({ res })

                return res
            })
            .catch(err => ({
                ok: false,
                ...err,
            }));
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleFileChange = (e) => {

        setSelectedFiles(e.target.files);
    };
    const prettyPrint = async (data) => {
        // var ugly = document.getElementById('myTextArea').value;
        // var obj = JSON.parse(ugly);
        // var pretty = JSON.stringify(obj, undefined, 4);
        // document.getElementById('myTextArea').value = pretty;
    }
    const showReport = async () => {
        setDisableButton(true);
        setTextarea("");
        try {
            const getReportDataResponse = await fetch(
                `https://api.ml.guidesly.com/api/v1/report/${inputValue}`, {
                mode: "cors",  // Change the mode to CORS  
            }
            );

            console.log('getReport Response status:', getReportDataResponse.status);
            console.log(
                'getReport Response headers:',
                JSON.stringify(getReportDataResponse.headers)
            );

            if (getReportDataResponse.ok) {
                // const _data = (await getReportDataResponse.json()) as Report;
                var refined = JSON.stringify(await getReportDataResponse.json(), undefined, 4);
                setTextarea(refined);
                // console.log('getReport Response data:', JSON.stringify(getReportDataResponse.json()));
                // return _data;
            } else {
                console.error(
                    'getReport Error response:',
                    await getReportDataResponse.text()
                );
            }
        }
        catch (err) { }
        setDisableButton(false)
    }
    const handleUpload = async () => {
        setDisableButton(true)
        const uploadImages = await uploadImagesToS3(selectedFiles, inputValue)
        if (uploadImages) {
            const result = await completedUpload(selectedFiles.length, inputValue);
            console.log('Upload completion result:', result);
            // onComplete(result);
        } else {
            console.error('Failed to upload images');
            // onComplete({ success: false, error: 'Failed to upload images' });
        }
        setDisableButton(false)
    };


    const ButtonComponent = () => {
        return (
            <>
                <div>
                    {/* <button className="primary-button" onClick={handleUpload}>Upload</button> */}
                    <Stack direction="horizontal" gap={2} justifyContent="center" alignItems="center" display="flex" style={{
                        marginTop: 10, marginBottom: 10, alignContent: "center", justifyContent: "center"
                    }} >


                        <Button variant={disableButton ? "secondary" : "primary"} disabled={disableButton} onClick={handleUpload}>
                            Upload
                        </Button>
                        {/* <Button variant="secondary"  onClick={handleUpload}>
                        Upload
                    </Button>
                    <button className="secondary-button">Generate Report</button> */}
                        {/* <button className={`secondary-button disabled`} onClick={showReport}>View Report</button> */}

                        <Button variant={disableButton ? "secondary" : "primary"} disabled={disableButton} onClick={showReport}>
                            View Report
                        </Button>
                    </Stack>
                </div>
                <div style={{ fontSize: '12px' }}>
                    <textarea value={textarea} rows="20" cols="80" width="500px"></textarea>
                </div>
            </>
        );
    };

    return (
        <div>
            <div className="image-uploader">

                <input
                    type="text"
                    value={inputValue}
                    width="150px"
                    onChange={handleInputChange}
                    placeholder="Enter Trip Guid"
                    className="beautiful-textbox"
                />
                <input type="file" multiple onChange={handleFileChange} id="file-input" />
                <label htmlFor="file-input">Choose Images</label>

            </div>

            <ButtonComponent></ButtonComponent>
        </div>
    );
};


export default ImageUploader;
