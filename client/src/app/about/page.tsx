"use client";

import About from "@/components/about/about";
import HeaderComponent from "@/components/header/header";
import { useEffect } from "react";

interface Props {}

function Page(props: Props) {
  const {} = props;

  useEffect(() => {
    // Принудительно обновляем стили при рендере страницы
    document.body.style.display = "block";
  }, []);

  return (
    <>
      <HeaderComponent />
      <About />
    </>
  );
}

export default Page;
