import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { NavLink } from "react-router-dom";
import React, { FC, useState, useEffect } from "react";
import * as image from "@/staticcloudIMG"; // '*': everything as image from [direction to cloud]
import "../css/Splash_screen.css";
//Have to show that we are experienced front-end as we group things together
export const Splash_screen: FC = () => {

    return ( // Return do not use {}
        <div className="Layout">
            <section id="header">
                <AdvancedImage cldImg={image.gocTrai}></AdvancedImage> {/* advance..: tag ; cldImg: attribute ; image. : indicate the format of the subject ; { }: */}
                <AdvancedImage cldImg={image.logo}></AdvancedImage> {/* advance..: tag ; cldImg: attribute ; image. : indicate the format of the subject ; { }: */}

            </section>
        </div>





    )


} 
