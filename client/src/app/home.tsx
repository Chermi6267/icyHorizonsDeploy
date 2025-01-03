"use client";

import HexMapMenu from "@/components/hexMapMenu/hexMapMenu";
import styles from "./page.module.scss";
import "./globals.scss";
import Header from "@/components/header/header";
import Catalog from "@/components/catalog/catalog";
import { IAdminCenter, ICategory, ILandmark } from "@/interfaces/landmark";
import AuthHandler from "@/components/auth/authHandler";
import Footer from "@/components/footer/footer";
import Tour from "@/components/tour/tour";
import { useRef } from "react";

export default function Home(props: {
  landmarks: ILandmark[];
  adminCenter: IAdminCenter;
  categories: ICategory[];
}) {
  const { landmarks, adminCenter, categories } = props;
  const hexMapRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AuthHandler />
      <Header />
      <main className={styles.main}>
        <Tour />

        <HexMapMenu
          hexMapRef={hexMapRef}
          initialLandmarkData={landmarks}
          initialAdminCenterData={adminCenter}
        />

        <Catalog
          hexMapRef={hexMapRef}
          initialLandmarkData={landmarks}
          initialAdminCenterData={adminCenter}
          categories={categories}
        />
      </main>
      <Footer />
    </>
  );
}
