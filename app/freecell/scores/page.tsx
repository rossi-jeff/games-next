"use client";

import { useRouter } from "next/navigation";
import { buildPaginatedUrl } from "../../../lib/get-paginated-scores";
import { fetcher } from "../../../lib/fetcher";
import useSWR from "swr";
import PaginationControl from "../../../components/pagination-control";
import { FreeCell } from "../../../types/free-cell.type";
import FreeCellScoreRow from "./free-cell-score-row";

export default function FreeCellScores({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const path = "/api/free_cell";
  const { limit, offset } = searchParams;
  const url = buildPaginatedUrl(path, limit, offset);
  const { data, error, isLoading } = useSWR(url.href, fetcher);
  const router = useRouter();

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>Loading ...</div>;

  const { Items, Count, Limit, Offset } = data;

  const pageChanged = (page: number) => {
    const offset = (page - 1) * Limit;
    router.push(`/freecell/scores?limit=${Limit}&offset=${offset}`);
  };

  const limitChanged = (limit: number) => {
    router.push(`/freecell/scores?limit=${limit}&offset=0`);
  };

  return (
    <div id="free-cell-scores" className="m-2">
      <h1>Free Cell Scores</h1>
      <div>
        <div className="score-header">
          <div className="cell-left">User</div>
          <div className="cell-center">Status</div>
          <div className="cell-center">Time</div>
          <div className="cell-right">Moves</div>
        </div>
        {Items.map((free_cell: FreeCell) => (
          <FreeCellScoreRow key={free_cell.id} free_cell={free_cell} />
        ))}
      </div>
      <PaginationControl
        count={Count}
        limit={Limit}
        offset={Offset}
        pageChanged={(page: number) => pageChanged(page)}
        limitChanged={(limit: number) => limitChanged(limit)}
      />
    </div>
  );
}
