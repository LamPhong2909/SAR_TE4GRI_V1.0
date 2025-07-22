//ĐÂY CÓ THỂ LÀ CÁI SỬ DỤNG NHỮNG PHẦN BÉ BÉ TỪ NHỮNG PAGE ,SOURCE KHÁC ĐỂ BUILD LÊN CÁI APP HOÀN CHỈNH  ĐÚNG KHÔNG NHỈ , CHẢ BIẾT NỮA
//NHƯ CÁI SPLASH LOADING SCREEN THÌ SẼ PHẢI Ở ĐÂY THEO LOGIC ĐỂ CODE RA CÁI LOGIC CÒN CÁI CONFIG CHỈ LÀ CÁI ĐỂ LƯU THÔNG TIN VẬY VẬY THÔI

import React, { useEffect, useState } from "react";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";
import { Splash_screen } from "./Splash screen"; //import source code frame splash
import { closeLoading } from "zmp-sdk";



const MyApp = () => {

  {/* TẮT SPLASH */ }
  const [showSplash, setShowSplash] = useState(true); //BIẾN SHOWSPLASH VÀ SETSHOWSPLASH THỰC RA LÀ BIẾN DO MÌNH TẠO RA RA VÀ SỬ DỤNG ĐẶC TÍNH CỦA USESTATE ĐÓ LÀ TRẢ VỀ giá trị trạng thái và 1 cái hàm để update nó

  useEffect(() => {
    const hideSplashScreen = async () => {
      try { //Khúc này là thuộc về hiện ra trong terminal , logging console giống như morphogenic trong outlast whistleblower
        const result = await closeLoading({});
        console.log("closeLoading SUCCEEDED", result);
      }
      catch (error) {
        console.error("closeLoading FAILED", error);

      }
    };

    const splashTimer = setTimeout(() => {
      hideSplashScreen();
    }, 2000);

    const uiTImer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(uiTImer);
    };



  }, []);




  return (
    <RecoilRoot>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-background-color": "#f4f5f6",
        }}
      >
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <Layout />
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </ConfigProvider>
    </RecoilRoot>
  );
};
export default MyApp;
