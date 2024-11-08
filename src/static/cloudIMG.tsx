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
export const logo = cld.image('Logo_hyqz85');
export const cameraIcon = cld.image('camera_l5wjqr');
export const logoGenius = cld.image('logo_fbhbpu');


