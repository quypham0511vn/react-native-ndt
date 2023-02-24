import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import {
    AccessToken,
    LoginManager,
    Profile
} from 'react-native-fbsdk-next';

import { configGoogleSignIn } from '@/common/constants';

GoogleSignin.configure(configGoogleSignIn);

export const loginWithGoogle = async () => {
    try {
        const { idToken } = await GoogleSignin.signIn();
        if (idToken) {
            const userInfo = await GoogleSignin.signInSilently();
            if (userInfo) GoogleSignin.signOut();
            console.log(userInfo?.user);
            return userInfo;
        }
        return null;
    } catch (err) {
        console.log('getAccessTokenGoogle error', err);
        return null;
    }
};

export const loginWithFacebook = async () => {
    try {
        const result = await LoginManager.logInWithPermissions(
            ['public_profile', 'email'],
            'limited',
            'my_nonce'
        );
        if (!result.isCancelled) {
            let data;
            if (Platform.OS === 'android') {
                data = await AccessToken.getCurrentAccessToken();
            }
            else {
                data = await Profile.getCurrentProfile();
                console.log('data', data);
            }
            if (data) LoginManager.logOut();
            return data;
        }
    } catch (error) {
        return null;
    }
};

export const loginWithApple = async () => {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
        });


        const data = appleAuthRequestResponse;
        console.log('email',data);
        if (data?.identityToken) {
            console.log('token', data?.identityToken);
            return data;
        }
        return null;
    } catch (error: any) {
        if (error?.code === appleAuth.Error.CANCELED) {
            console.warn('User canceled Apple Sign in.');
        } else {
            console.error(error);
        }
        return null;
    }
};
