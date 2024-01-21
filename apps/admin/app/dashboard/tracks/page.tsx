import { prisma } from "@repo/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Braces, ExternalLink, Pencil } from "lucide-react";
import CreateNewRecord, { DeleteButton } from "./page.client";

export const dynamic = "force-dynamic";

async function Tracks() {
  const tracks = await prisma.track.findMany({
    select: { id: true, description: true, logo: true, name: true, slug: true },
  });
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-full">
          <div className="ml-auto mb-2">
            <CreateNewRecord />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>{track.name}</TableCell>
                <TableCell>{track.description?.substring(0, 30)}...</TableCell>
                <TableCell>/{track.slug}</TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={track.logo!} />
                    <AvatarFallback>{track.name}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="flex items-center justify-center flex-row max-w-[100px]">
                  <Link href={`/dashboard/tracks/${track.slug}`}>
                    <Button variant={"ghost"}>
                      <Pencil />
                    </Button>
                  </Link>
                  <DeleteButton id={track.id} />
                  <Link
                    href={`/api/tracks/${track.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant={"ghost"}>
                      <Braces />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Tracks;
