import { Metadata } from "next";
import LandmarkContent from "@/components/landmark/landmarkContent";

export const generateMetadata = async ({
  params,
}: {
  params: { landmarkId: string };
}): Promise<Metadata> => {
  const landmarkResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/landmark/id/${params.landmarkId}`
  );
  const landmark = await landmarkResponse.json();

  return {
    title: `Icy Horizons | ${landmark.name}`,
    description: `${landmark.description}`,
  };
};

const LandmarkPage = async ({ params }: { params: { landmarkId: string } }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/landmark/id/${params.landmarkId}`,
    { cache: "no-store" }
  );

  const landmark = await response.json();

  return <LandmarkContent initialLandmarkData={landmark} />;
};

export default LandmarkPage;
