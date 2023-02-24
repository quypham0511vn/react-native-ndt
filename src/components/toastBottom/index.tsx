import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import Toast from 'react-native-easy-toast';

import { TOAST_POSITION } from '@/common/Configs';
import MyStylesToast from './styles';

type ToastAction = {
    showToast?: (msg: string) => any;
}

export const ToastBottom = forwardRef<ToastAction>((props, ref) => {
    const toastRef = useRef<any>(null);
    const styles = MyStylesToast();

    useImperativeHandle(ref, () => ({
        showToast
    }));

    const showToast = useCallback((msg: string) => {
        toastRef?.current?.show(msg, 2000);
    }, []);

    return (
        <Toast
            ref={toastRef}
            position={'bottom'}
            style={styles.toast}
            positionValue={TOAST_POSITION}
            fadeInDuration={750}
            fadeOutDuration={1000}
        />
    );
}
);

