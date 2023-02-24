// import { observer } from 'mobx-react';
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//     NativeModules,
//     SafeAreaView,
//     StatusBar, Text,
//     TouchableOpacity,
//     View,
//     ViewStyle
// } from 'react-native';
// import FastImage from 'react-native-fast-image';
// import { runOnJS } from 'react-native-reanimated';
// import {
//     Camera,
//     CameraCaptureError,
//     useCameraDevices,
//     useFrameProcessor
// } from 'react-native-vision-camera';
// import { Face, scanFaces } from 'vision-camera-face-detector';

// import BackIc from '@/assets/image/ic_back_camera.svg';
// import CancelButonIc from '@/assets/image/ic_cancel_buton_camera.svg';
// import CaptureIc from '@/assets/image/ic_capture_camera.svg';
// import TickedButonIc from '@/assets/image/ic_checked_camera.svg';
// import RollIc from '@/assets/image/ic_roll_camera.svg';
// import CancelIc from '@/assets/image/ic_white_cancel_camera.svg';
// import TickedIc from '@/assets/image/ic_white_tick_camera.svg';
// import { ENUM_TYPE_CAMERA, ENUM_TYPE_CARD_CAMERA } from '@/common/constants';
// import Languages from '@/common/Languages';
// import ScreenName from '@/common/screenNames';
// import ScanRetangle, { DetectedRectangleModel, ScanRetangleActionsTypes } from '@/components/cardDetect';
// import Loading from '@/components/loading';
// import { useAppStore } from '@/hooks';
// import Navigator from '@/routers/Navigator';
// import { COLORS } from '@/theme';
// import FaceDetectUtils from '@/utils/FaceDetectUtils';
// import ImageUtils from '@/utils/ImageUtils';
// import { MyStylesAccountDetect } from './styles';

// const CameraManager = NativeModules.RNRectangleScannerManager || {};

// const AccountDetect = observer(({ route }: any) => {
//     const { userManager } = useAppStore();
//     const typeCamera = route?.params?.typeCamera;
//     const typeCard = route?.params?.typeCard;

//     const devices = useCameraDevices();
//     const deviceFront = devices?.front;
//     const styles = MyStylesAccountDetect();

//     const [isBack, setIsBack] = useState<boolean>(false);
//     const [faces, setFaces] = useState<Face[]>([]);
//     const [avatarImg, setAvatar] = useState<any>();

//     const [frontCard, setFrontCard] = useState<string>();
//     const [backCard, setBackCard] = useState<string>();

//     const [scanCard, setScanCard] = useState<DetectedRectangleModel>({});
//     const [isLoading, setLoading] = useState<boolean>(false);

//     const camera = useRef<Camera>(null);
//     const scanCardRef = useRef<ScanRetangleActionsTypes>(null);

//     useEffect(() => {
//         (async () => {
//             await Camera.requestCameraPermission();
//         })();
//     }, []);

//     const frameProcessor = useFrameProcessor((frame) => {
//         'worklet';

//         const scannedFaces = scanFaces(frame);
//         console.log('scanface =', JSON.stringify(scannedFaces));

//         runOnJS(setFaces)(scannedFaces);
//     }, []);

//     const showBackCamera = useCallback(() => {
//         setIsBack((last) => !last);
//     }, []);

//     const takePhotoCard = useCallback(async () => {
//         if (FaceDetectUtils.authenCard(scanCard)) {
//             CameraManager.capture();
//             scanCardRef?.current?.onCapture();
//         }
//     }, [scanCard]);

//     const takePhotoFace = useCallback(() => {
//         try {
//             setLoading(true);
//             camera?.current
//                 ?.takePhoto({
//                     flash: 'off'
//                 })
//                 .then(async (res) => {
//                     setLoading(false);
//                     if (res) {
//                         console.log('res = ', res);
//                         setAvatar(res);
//                     }
//                 });
//         } catch (e) {
//             if (e instanceof CameraCaptureError) {
//                 switch (e.code) {
//                     case 'capture/file-io-error':
//                         console.error('Failed to write photo to disk!');
//                         break;
//                     default:
//                         console.error(e);
//                         break;
//                 }
//             }
//         }
//     }, []);

//     const cancelScanImg = useCallback(() => {
//         if (typeCard === ENUM_TYPE_CARD_CAMERA.FRONT) {
//             setFrontCard('');
//         } else if (typeCard === ENUM_TYPE_CARD_CAMERA.BACK) {
//             setBackCard('');
//         } else {
//             setAvatar(null);
//         }
//     }, [typeCard]);

//     const onNavigateBack = useCallback(() => {
//         Navigator.goBack();
//         cancelScanImg();
//     }, [cancelScanImg]);

//     const handleSetCardImageSize = useCallback(async (response: any) => {
//         if (typeCard === ENUM_TYPE_CARD_CAMERA.FRONT) {
//             setFrontCard(response?.uri);
//             userManager.updateUserInfo({
//                 ...userManager.userInfo,
//                 front_facing_card: `${response?.uri}`
//             });
//         } else {
//             setBackCard(response?.uri);
//             userManager.updateUserInfo({
//                 ...userManager.userInfo,
//                 card_back: `${response?.uri}`
//             });
//         }
//         Navigator.navigateScreen(ScreenName.accountIdentify, { isSaveCache: true });


//     }, [typeCard, userManager]);

//     const confirmScanImg = useCallback(async () => {
//         setLoading(true);
//         if (typeCamera === ENUM_TYPE_CAMERA.FACE) {
//             userManager.updateUserInfo({
//                 ...userManager.userInfo,
//                 avatar: `${Languages.common.fileDir}${avatarImg?.path}`
//             });
//             Navigator.navigateScreen(ScreenName.accountIdentify, { isSaveCache: true });
//         } else if (typeCard === ENUM_TYPE_CARD_CAMERA.FRONT) {

//             ImageUtils.onResizeImage(
//                 `${frontCard}`,
//                 handleSetCardImageSize
//             );


//         } else {
//             ImageUtils.onResizeImage(
//                 `${backCard}`,
//                 handleSetCardImageSize
//             );
//         }
//         setLoading(false);

//     }, [avatarImg?.path, backCard, frontCard, handleSetCardImageSize, typeCamera, typeCard, userManager]);

//     const renderButon = useCallback((icon: any, btnStyle: any, _onPress: any, hasBorderRadio?: boolean, isOpacity?: boolean, _btnStyleContainer?: any) => {
//         const opacityItem = {
//             opacity: FaceDetectUtils.authenFace(faces) || FaceDetectUtils.authenCard(scanCard) ? 1 : 0.7
//         } as ViewStyle;

//         return (
//             <TouchableOpacity
//                 style={[
//                     isOpacity ? opacityItem : undefined,
//                     hasBorderRadio ? styles.btnStyleContainer : styles.btnNOBOrder,
//                     _btnStyleContainer
//                 ]}
//                 onPress={_onPress}
//             >
//                 <View style={[btnStyle, isOpacity ? opacityItem : undefined]}>
//                     {icon}
//                 </View>

//             </TouchableOpacity>
//         );
//     }, [faces, scanCard, styles.btnNOBOrder, styles.btnStyleContainer]);

//     const renderCardsScan = useCallback(
//         (_ref: any, _setScan: any, _setValue?: any, _value?: string) => (
//             <>
//                 <View style={styles.wrapIconCheckCard}>
//                     {FaceDetectUtils.authenCard(scanCard) || frontCard || backCard ?
//                         <TickedButonIc /> :
//                         <CancelButonIc />}
//                 </View>
//                 <ScanRetangle ref={_ref}
//                     setPositionScan={_setScan}
//                     setOriginImg={_setValue}
//                     imgCapture={_value}
//                 />
//             </>

//         ),
//         [backCard, frontCard, scanCard, styles.wrapIconCheckCard]
//     );

//     const renderCam = useCallback(
//         (
//             _ref: any,
//             _back?: any,
//             _front?: any,
//             _framePro?: any,
//             hasColorStroke?: boolean
//         ) => {

//             const borderColor = {
//                 borderColor: hasColorStroke || avatarImg?.path ? COLORS.GREEN_2 : COLORS.RED_6
//             } as ViewStyle;

//             return (
//                 <>
//                     <View style={styles.wrapIconCheck}>
//                         {avatarImg?.path || FaceDetectUtils.authenFace(faces) ?
//                             <TickedButonIc /> :
//                             <CancelButonIc />}
//                     </View>
//                     <View style={[styles.cameraContainer, borderColor]}>
//                         {avatarImg?.path ?
//                             <FastImage
//                                 source={{ uri: `${Languages.common.fileDir}${avatarImg?.path}` }}
//                                 style={styles.wrapImage}
//                             /> :
//                             <Camera
//                                 ref={camera}
//                                 photo={true}
//                                 style={styles.wrapSelfCamera}
//                                 device={isBack ? _back : _front}
//                                 isActive={true}
//                                 fps={30}
//                                 frameProcessor={_framePro}
//                                 frameProcessorFps={5}
//                             ></Camera>
//                         }
//                     </View>

//                 </>
//             );
//         },
//         [avatarImg?.path, faces, isBack, styles.cameraContainer, styles.wrapIconCheck, styles.wrapImage, styles.wrapSelfCamera]
//     );

//     const renderDetectCam = useMemo(() => {
//         if (deviceFront == null) {
//             return <View style={styles.container}><Loading isOverview /></View>;
//         } return <>
//             {renderCam(
//                 camera,
//                 devices?.back,
//                 devices?.front,
//                 frameProcessor,
//                 FaceDetectUtils.authenFace(faces)
//             )}
//         </>;
//     }, [deviceFront, devices?.back, devices?.front, faces, frameProcessor, renderCam, styles.container]);

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar
//                 translucent
//                 backgroundColor={COLORS.TRANSPARENT}
//                 barStyle={'light-content'} />

//             <View style={styles.container}>
//                 <View style={styles.wrapTitle}>
//                     <Text style={styles.txtTitle}>
//                         {
//                             typeCamera === ENUM_TYPE_CAMERA.FACE ?
//                                 Languages.accountIdentify.capturePerson :
//                                 Languages.accountIdentify.captureCard
//                         }
//                     </Text>
//                 </View>
//                 <View style={styles.bodyContainer}>
//                     <View style={styles.scanContainer}>
//                         {
//                             typeCamera === ENUM_TYPE_CAMERA.FACE ?
//                                 renderDetectCam
//                                 :
//                                 renderCardsScan(
//                                     scanCardRef,
//                                     setScanCard,
//                                     typeCard === ENUM_TYPE_CARD_CAMERA.FRONT ? setFrontCard : setBackCard,
//                                     typeCard === ENUM_TYPE_CARD_CAMERA.FRONT ? frontCard : backCard)
//                         }
//                     </View>
//                     <View style={styles.actionContainer}>
//                         <Text style={styles.noteCaptureText}>

//                             {!avatarImg?.path ?
//                                 typeCamera === ENUM_TYPE_CAMERA.FACE ?
//                                     Languages.accountIdentify.noteCapturePerson :
//                                     Languages.accountIdentify.noteCaptureCard :
//                                 typeCamera === ENUM_TYPE_CAMERA.FACE ?
//                                     Languages.accountIdentify.confirmCapturePerson :
//                                     Languages.accountIdentify.confirmCaptureCard
//                             }
//                         </Text>

//                         {avatarImg?.path || frontCard || backCard ?

//                             <View style={styles.wrapViewBtnTakePhoto}>
//                                 {renderButon(
//                                     <TickedIc />,
//                                     styles.wrapBtnApproveImg,
//                                     confirmScanImg,
//                                     true,
//                                     false,
//                                     styles.borderConfirmImg
//                                 )}
//                                 {renderButon(
//                                     <CancelIc />,
//                                     styles.wrapBtnCancelImg,
//                                     cancelScanImg,
//                                     true,
//                                     false,
//                                     styles.borderCancelImg
//                                 )}
//                             </View> :
//                             <View style={styles.wrapViewBtnTakePhoto}>
//                                 {renderButon(
//                                     <BackIc />,
//                                     styles.wrapBtnChangeTypeCamera,
//                                     onNavigateBack
//                                 )}
//                                 {renderButon(
//                                     <CaptureIc />,
//                                     styles.wrapBtnTakeCamera,
//                                     typeCamera === ENUM_TYPE_CAMERA.FACE ?
//                                         (FaceDetectUtils.authenFace(faces) ? takePhotoFace : undefined) :
//                                         (FaceDetectUtils.authenCard(scanCard) ? takePhotoCard : undefined),
//                                     true,
//                                     true
//                                 )}
//                                 {typeCamera === ENUM_TYPE_CAMERA.FACE &&
//                                     renderButon(
//                                         <RollIc />,
//                                         styles.wrapBtnChangeTypeCamera,
//                                         showBackCamera
//                                     )}
//                             </View>
//                         }
//                     </View>
//                 </View>

//                 {isLoading && <Loading isOverview />}
//             </View>
//         </SafeAreaView>
//     );
// });


// export default AccountDetect;
