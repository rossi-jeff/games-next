"use client";

import { buildPaginatedUrl } from "../../../lib/get-paginated-scores";
import { fetcher } from "../../../lib/fetcher";
import useSWR from "swr";
import PaginationControl from "../../../components/pagination-control";
import { useRouter } from "next/navigation";
import { SeaBattle } from "../../../types/sea-battle.type";
import SeaBattleScoreRow from "./sea-battle-score-row";

export default function SeaBattleScores({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const path = "/api/sea_battle";
  const { limit, offset } = searchParams;
  const url = buildPaginatedUrl(path, limit, offset);
  const { data, error, isLoading } = useSWR(url.href, fetcher);
  const router = useRouter();

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>Loading ...</div>;

  const { Items, Count, Limit, Offset } = data;

  const pageChanged = (page: number) => {
    const offset = (page - 1) * Limit;
    router.push(`/seabattle/scores?limit=${Limit}&offset=${offset}`);
  };

  const limitChanged = (limit: number) => {
    router.push(`/seabattle/scores?limit=${limit}&offset=0`);
  };

  return (
    <div id="sea-battle-scores" className="m-2">
      <h1>Sea Battle Scores</h1>
      <div>
        <div className="score-header">
          <div className="cell-left"></div>
          <div className="cell-center">User</div>
          <div className="cell-center">Status</div>
          <div className="cell-center">Score</div>
          <div className="cell-right">Axis</div>
        </div>
        {Items.map((sea_battle: SeaBattle) => (
          <SeaBattleScoreRow key={sea_battle.id} sea_battle={sea_battle} />
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
