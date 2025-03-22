"use client";

import HexMapMenu from "@/components/hexMapMenu/hexMapMenu";
import styles from "./page.module.scss";
import "./globals.css";
import Header from "@/components/header/header";
import Catalog from "@/components/catalog/catalog";
import { IAdminCenter, ICategory, ILandmark } from "@/interfaces/landmark";
import Footer from "@/components/footer/footer";
import Tour from "@/components/tour/tour";
import { useRef } from "react";
import AdminCenterStatistic from "@/components/AdminCenterStatistic/adminCenterStatistic";

export default function Home(props: {
  landmarks: ILandmark[];
  adminCenter: IAdminCenter;
  categories: ICategory[];
}) {
  const { landmarks, adminCenter, categories } = props;
  const hexMapRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Header />
      <main className={styles.main}>
        <HexMapMenu
          hexMapRef={hexMapRef}
          initialLandmarkData={landmarks}
          initialAdminCenterData={adminCenter}
        />

        <AdminCenterStatistic />

        <Tour />

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
