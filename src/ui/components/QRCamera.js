import { Camera, CameraResultType } from '@capacitor/camera';
import styles from "../css/index.module.css";
import React from "react";
import Separator from "../elements/Separator";

export default function QRCamera(props) {

    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Uri
        });

        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        let imageUrl = image.webPath;

        // Can be set to the src of an image now
        // imageElement.src = imageUrl;


        props.setCamera(false)
    };

    return (
        <div className={styles.main}>
            <div className={styles.content}>

                <div className={styles.field}>Camera</div>

            </div>

            <div className={styles.form}>

                <div onClick={takePicture}
                     className={styles.field + ' ' + styles.button + ' ' + styles.red}>Scan
                </div>

                <Separator/>

            </div>
        </div>
    )
}