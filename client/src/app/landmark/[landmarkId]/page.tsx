import { Metadata } from "next";
import LandmarkContent from "./landmarkContent";

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
  const landmarkResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/landmark/id/${params.landmarkId}`,
    {
      next: {
        revalidate: 60 * 30,
        tags: [`landmark${params.landmarkId}`],
      },
    }
  );
  const landmark = await landmarkResponse.json();

  return <LandmarkContent initialLandmarkData={landmark} />;
};

export default LandmarkPage;
