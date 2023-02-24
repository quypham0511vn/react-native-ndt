// import React, {
//     forwardRef,
//     useCallback,
//     useEffect,
//     useImperativeHandle,
//     useState
// } from 'react';
// import {
//     Image,
//     NativeModules,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     ViewProps,
//     ViewStyle
// } from 'react-native';
// import { Camera, CameraCaptureError, useCameraDevices } from 'react-native-vision-camera';
// import { Face } from 'vision-camera-face-detector';

// import { COLORS } from '@/theme';
// import { DetectedRectangleModel } from '../cardDetect';

// export interface FaceDetectActionsTypes {
//     onHide: () => void;
//     onShow: () => void;
//     capture: () => void;
// }

// export interface FaceDetectProps {
//     hasColor?: boolean;
//     format?: any;
//     imgFlash?: any;
//     imgCapture?: any;
//     imgCancel?: any;
//     framePro?: any;
//     scanContainer?: ViewProps;
//     flashContainer?: ViewProps;
//     cancelContainer?: ViewProps;
//     captureContainer?: ViewProps;
//     onTakePhoto?: (fileDir?: string) => void;
//     isBack?: boolean;
//     isFlash?: boolean;
// }

// const CameraManager = NativeModules.RNRectangleScannerManager || {};

// const FaceDetectComponent = forwardRef<FaceDetectActionsTypes, FaceDetectProps>(
//     (
//         {
//             format,
//             imgFlash,
//             imgCapture,
//             imgCancel,
//             framePro,
//             flashContainer,
//             cancelContainer,
//             captureContainer,
//             scanContainer,
//             hasColor,
//             isBack,
//             isFlash,
//             onTakePhoto
//         },
//         ref: any
//     ) => {
//         const [isShow, setShow] = useState<boolean>(false);
//         const [isHasFlash, setHasFlash] = useState<boolean>(true);
//         const [position, setPosition] = useState<DetectedRectangleModel>();
//         const [originImg, setOriginImg] = useState<string>();

//         const opacityBtn = {
//             opacity: hasColor ? 1 : 0.3
//         } as ViewStyle;

//         const greenColor = {
//             borderColor: hasColor ? COLORS.GREEN : COLORS.RED
//         } as ViewStyle;

//         const devices = useCameraDevices();

//         useEffect(()=>{
//             if(devices === null){
//                 alert('Thieu device id');
//             }
//         },[devices]);

//         useEffect(() => {
//             (async () => {
//                 await Camera.getAvailableCameraDevices().then((res) => {
//                     console.log('res =', JSON.stringify(res));
//                 });
//             })();
//         }, []);

//         const onShow = useCallback(() => {
//             setShow(true);
//         }, []);

//         const onHide = useCallback(() => {
//             setShow(false);
//         }, []);

//         const onCapture = useCallback(() => {
//             CameraManager.capture();
//             onTakePhoto?.();
//         }, [onTakePhoto]);

//         const onSetFlash = useCallback(() => {
//             setHasFlash(last => !last);
//         }, []);

//         useImperativeHandle(ref, () => ({
//             onShow,
//             onHide,
//             onCapture
//         }));

//         const authenFace = (objects: Face[]) => {
//             if (
//                 objects?.length === 1
//                 &&
//                 objects[0].yawAngle > -6 &&
//                 objects[0].yawAngle <= 6 &&
//                 objects[0].pitchAngle > -6 &&
//                 objects[0].pitchAngle <= 6 &&
//                 objects[0].rollAngle > -6 &&
//                 objects[0].rollAngle <= 6 &&
//                 objects[0].leftEyeOpenProbability > 0 &&
//                 objects[0].rightEyeOpenProbability > 0
//             ) {
//                 return true;
//             }
//             return false;
//         };


//         const OnTakePhoto = useCallback(async () => {
//             try {
//                 const photo = await ref?.current
//                     ?.takePhoto({
//                         flash: 'off'
//                     })
//                     .then((res: any) => {
//                         console.log('res = ', res);
//                         // setImg(res); // tra ve path image, width,...
//                         setShow((last) => !last);
//                     });
//             } catch (e) {
//                 if (e instanceof CameraCaptureError) {
//                     switch (e.code) {
//                         case 'capture/file-io-error':
//                             console.error('Failed to write photo to disk!');
//                             break;
//                         default:
//                             console.error(e);
//                             break;
//                     }
//                 }
//             }
//         }, [ref]);

//         return (
//             <>
//                 {isShow && (
//                     <>
//                         <View style={[styles.container, scanContainer, greenColor]}>
//                             <Camera
//                                 ref={ref}
//                                 photo={true}
//                                 style={[styles.wrapSelfCamera, greenColor]}
//                                 device={isBack ? devices.back : devices.back}
//                                 isActive={true}
//                                 fps={30}
//                                 frameProcessor={framePro}
//                                 frameProcessorFps={1}
//                                 hdr={true}
//                                 lowLightBoost={true}
//                                 enableZoomGesture={true}
//                                 format={format}
//                             ></Camera>
//                         </View>
//                         <View style={styles.wrapOptionScan}>
//                             <TouchableOpacity
//                                 onPress={onSetFlash}
//                                 style={[styles.wrapSetFlash, flashContainer]}>
//                                 {imgFlash || <Text>Flash</Text>}
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 onPress={position?.detectedRectangle ? OnTakePhoto : undefined}
//                                 style={[styles.wrapCapture, captureContainer, opacityBtn]}>
//                                 {imgCapture || <Text>Capture</Text>}
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 onPress={onHide}
//                                 style={[styles.wrapCancel, cancelContainer]}>
//                                 {imgCancel || <Text>Cancel</Text>}
//                             </TouchableOpacity>
//                         </View>
//                     </>
//                 )}
             
//                 {!isShow && (
//                     <>
//                         {originImg && (
//                             <Image
//                                 source={{
//                                     uri: `${originImg}`
//                                 }}
//                                 style={styles.imgContainer}
//                             />
//                         )}
//                         <TouchableOpacity style={styles.wrapOpenScanBtn} onPress={onShow}>
//                             <Text style={styles.txtOpenScanBtn}>Start Scan Card</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}
//             </>
//         );
//     }
// );
// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '80%',
//         height: '50%',
//         borderRadius: 20,
//         borderWidth: 8,
//         overflow: 'hidden',
//         borderColor: COLORS.RED
//     },
//     wrapSelfCamera: {
//         width: '100%',
//         height: '100%',
//         marginRight: 8,
//         marginTop: -8
//     },
//     wrapOptionScan: {
//         flexDirection: 'row'
//     },
//     wrapCancel: {
//         width: 60,
//         height: 60,
//         borderColor: COLORS.PINK,
//         borderWidth: 5,
//         backgroundColor: COLORS.YELLOW,
//         borderRadius: 40,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     wrapCapture: {
//         width: 90,
//         height: 90,
//         borderColor: COLORS.PINK,
//         borderWidth: 5,
//         backgroundColor: COLORS.RED,
//         borderRadius: 90,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     wrapSetFlash: {
//         width: 60,
//         height: 60,
//         borderColor: COLORS.PINK,
//         borderWidth: 5,
//         backgroundColor: COLORS.YELLOW,
//         borderRadius: 40,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     wrapOpenScanBtn: { backgroundColor: COLORS.GRAY },
//     txtOpenScanBtn: { paddingVertical: 10 },
//     imgContainer: {
//         width: 300,
//         height: 300
//     }
// });
// export default FaceDetectComponent;
