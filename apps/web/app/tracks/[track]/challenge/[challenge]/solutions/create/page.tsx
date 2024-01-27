import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PageProps } from "../../$types";

async function CreateSolution({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id)
    redirect(`/track/${params.track}/challenge/${params.challenge}`);
  return (
    <div className="container">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quaerat
      eligendi ut voluptatem libero magni quae hic sunt distinctio a.
    </div>
  );
}

export default CreateSolution;
