import { getCachedEnrolledTracks } from "@/cache/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

async function Tracks({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username).replace("@", "");
  const tracks = await getCachedEnrolledTracks(username);
  return (
    <>
      <div className="flex flex-col p-6 pb-0">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Enrolled Tracks
        </h3>
      </div>
      <div className="p-6">
        {tracks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="not-in-markdown">
                <TableHead className="not-in-markdown">Name</TableHead>
                <TableHead className="not-in-markdown">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.id} className="not-in-markdown">
                  <TableCell className="font-medium not-in-markdown">
                    <Link
                      href={`/track/${track.slug}`}
                      className="hover:underline"
                    >
                      {track.name}
                    </Link>
                  </TableCell>
                  <TableCell className="not-in-markdown">
                    <p className="line-clamp-1">{track.description}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </div>
    </>
  );
}

export default Tracks;
