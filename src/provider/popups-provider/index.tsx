import { configure } from 'mobx';
import { Observer, useLocalObservable } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Toast from 'react-native-easy-toast';

import Validate from '@/utils/Validate';
import { EventEmitter } from '@/utils/EventEmitter';
import { Events } from '@/common/constants';
import { TOAST_POSITION } from '../../common/Configs';
import { COLORS } from '../../theme';
import { PopupContext } from './context';

configure({
    enforceActions: 'never'
});

export const PopupsProvider = ({ children }: any) => {
    const toastRef = useRef<any>(null);
    const [toastType, setToastType] = useState('MSG');

    const showToast = useCallback((obj: any) => {
        const { type, msg } = obj;
        if (toastRef?.current && !Validate.isStringEmpty(msg)) {
            setToastType(type);
            toastRef?.current?.show(msg, 2000);
        }
    }, []);

    useEffect(() => {
        EventEmitter.addListener(Events.TOAST, showToast);
        return () => {
            EventEmitter.removeListener(Events.TOAST, showToast);
        };
    }, [showToast]);

    useEffect(()=>{

    },[]);

    const store = useLocalObservable(() => ({
        isVisible: false,
        data: {}
    }));

    const handleShowDialog = useCallback((data: any) => {
        store.isVisible = true;
        store.data = data;
    }, [store]);

    const handleCloseDialog = useCallback(() => {
        store.isVisible = false;
        store.data = {};
    }, [store]);

    const contextValue = useMemo(
        () => ({
            close: handleCloseDialog,
            show: handleShowDialog
        }),
        [handleCloseDialog, handleShowDialog]
    );

    const renderPopup = useCallback(() => {
        if (store.isVisible) {
            const type = (store?.data as any).type;
            switch (type) {
                default: return null;
            }
        }
        return null;
    }, [store?.data, store.isVisible]);

    const toastBackground = useMemo(() => {
        let color = COLORS.BLACK;
        switch (toastType) {
            case 'MSG':
                color = COLORS.BLACK;
                break;
            case 'ERR':
                color = COLORS.RED_1;
                break;
            case 'SUCCESS':
                color = COLORS.DARK_GREEN;
                break;
            default: break;
        }
        return [styles.toast, { backgroundColor: color, top: 0, padding: 5, justifyContent: 'center' }] as ViewStyle;
    }, [toastType]);

    const renderToast = useMemo(() => <Toast
        ref={toastRef}
        position={'top'}
        style={toastBackground}
        positionValue={TOAST_POSITION}
    />, [toastBackground]);

    return (<>
        <PopupContext.Provider value={contextValue}>
            {children}
        </PopupContext.Provider>
        <Observer>
            {renderPopup}
        </Observer>
        {renderToast}
    </>
    );
};

const styles = StyleSheet.create({
    toast: {
        borderRadius: 10,
        padding: 2,
        minHeight: 45,
        marginHorizontal: 10
    }
});
