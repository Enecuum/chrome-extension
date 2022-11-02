import { Camera, CameraResultType } from '@capacitor/camera';
import styles from "../css/index.module.css";
import React, {useEffect} from "react";
import Separator from "../elements/Separator";
import Back from "../elements/Back";
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {REFERRAL} from "../../utils/names";

export default function QRCamera(props) {

    const startScan = async () => {
        // // Check camera permission
        // // This is just a simple example, check out the better checks below
        // await BarcodeScanner.checkPermission({ force: true })
        //
        // // make background of WebView transparent
        // // note: if you are using ionic this might not be enough, check below
        // await BarcodeScanner.hideBackground()
        // const result = await BarcodeScanner.startScan() // start scanning and wait for a result

        // if the result has content
        if (result.hasContent) {
            console.log(result.content) // log the raw scanned content
            localStorage.setItem(REFERRAL, result.content)
            props.setCamera(false)
        }

        document.body.classList.add('scanner-active')
    }

    // const takePicture = async () => {
    //     const image = await Camera.getPhoto({
    //         quality: 90,
    //         allowEditing: true,
    //         resultType: CameraResultType.Uri
    //     });
    //
    //     // image.webPath will contain a path that can be set as an image src.
    //     // You can access the original file using image.path, which can be
    //     // passed to the Filesystem API to read the raw data of the image,
    //     // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    //     let imageUrl = image.webPath;
    //
    //     // Can be set to the src of an image now
    //     // imageElement.src = imageUrl;
    //
    //
    //     props.setCamera(false)
    // };

    useEffect(() => {
        startScan()
    }, [])

    return (
        <div className={styles.main}>

            <Back setFalse={() => {
                // document.querySelector('body').classList.remove('scanner-active')
                // BarcodeScanner.showBackground().then()
                // BarcodeScanner.stopScan().then()
                props.setCamera(false)
            }}/>

            <div className={styles.content + ' ' + styles.camera}>

                <div className={styles.field}>Camera</div>

            </div>

            <div className={styles.form}>

                {/*<div onClick={startScan}*/}
                {/*     className={styles.field + ' ' + styles.button}>Scan*/}
                {/*</div>*/}

                <Separator/>

            </div>
        </div>
    )
}