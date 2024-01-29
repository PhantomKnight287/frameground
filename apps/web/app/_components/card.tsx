import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@repo/utils";

function EnrollCard({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-[430px] max-h-[280px]", className)}>
      <CardHeader className="space-y-5">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="h-[14px] bg-[#D9D9D9] rounded-md max-w-[45%] w-[45%]" />
          <div className="h-[14px] bg-[#D9D9D9] rounded-md max-w-[15%] w-[15%]" />
        </div>

        <div className="flex flex-col items-start justify-start w-full mt-10 space-y-2">
          <div className="h-[14px] bg-[#8E8E8E] rounded-md max-w-[89%] w-[89%]" />
          <div className="h-[14px] bg-[#8E8E8E] rounded-md max-w-[45%] w-[45%]" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 py-4">
        <Button className="w-full">Enroll</Button>
        <Button variant="outline" className="w-full">
          View Content
        </Button>
      </CardContent>
    </Card>
  );
}

export default EnrollCard;
