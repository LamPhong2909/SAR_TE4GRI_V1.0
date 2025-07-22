import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: { cloudName: "dozxc6jqp" },
});

//Layout
export const backgroundImage = cld.image("background_splpcs")

//HOME page
export const searchIcon = cld.image("chooseImage_adnyec");
export const calendarIcon = cld.image("timecare_kajvsp");
export const scanIcon = cld.image("Scan_mngzut");
export const shareIcon = cld.image("Share_xkwyye");
export const diaryIcon = cld.image("Nhatky_e4bhno");
export const dataIcon = cld.image("Database_qojg8p");
export const adviceImage = cld.image("Advice_u38c2v");
export const greenLeaves = cld.image("Back_top_ieqfvz");
export const messageIcon = cld.image("Picture1_aob9d0");
export const bellIcon = cld.image("bell_s7szvj");
export const step1 = cld.image("1_yjm8vw");
export const step2 = cld.image("2_asreun");
export const step3 = cld.image("3_test_ci6luf");
export const phanTrang = cld.image("phantrang_pozof4");
export const heoRu = cld.image("heoru_qrqwms");
export const domVan = cld.image("domvan_qeybed");
export const domDen = cld.image("domden_m8uaer");

//SCAN PAGE
export const khungChup = cld.image('ScanImg_kbmxup');
export const logo = cld.image('Logo_hyqz85'); //Logo App 
export const cameraIcon = cld.image('camera_l5wjqr');
export const logoGenius = cld.image('logo_fbhbpu');
export const scanButton = cld.image('ScanIcon_ky0cqd');
export const khungTrang = cld.image ('truongIcon_ymmsyn');
export const chooseImage = cld.image('chooseImage_adnyec');
export const backArrowIcon=cld.image('backIcon_mf24nb');
export const tickIcon = cld.image('acceptIcon_c1gjvg');
export const cornIcon=cld.image('cornIcon_ea05og');
export const riceIcon=cld.image('paddyIcon_iu3yfi');




// LOADING PAGE
// export const anhNen = cld.image('Background_home_bs115l')
export const gocTrai = cld.image('Leaves_corner_home_nuerd3')
export const gocPhai = cld.image('right_corner_leave_home_raoyen')
export const logoSAR = cld.image('SAR_department_logo_ve6pp8')


