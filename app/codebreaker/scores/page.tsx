"use client";

import { useRouter } from "next/navigation";
import { buildPaginatedUrl } from "../../../lib/get-paginated-scores";
import { fetcher } from "../../../lib/fetcher";
import useSWR from "swr";
import PaginationControl from "../../../components/pagination-control";
import { CodeBreaker } from "../../../types/code-breaker.type";
import CodeBreakerScoreRow from "./code-breaker-score-row";

export default function CodeBreakerScores({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const path = "/api/code_breaker";
  const { limit, offset } = searchParams;
  const url = buildPaginatedUrl(path, limit, offset);
  const { data, error, isLoading } = useSWR(url.href, fetcher);
  const router = useRouter();

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>Loading ...</div>;

  const { Items, Count, Limit, Offset } = data;

  const pageChanged = (page: number) => {
    const offset = (page - 1) * Limit;
    router.push(`/codebreaker/scores?limit=${Limit}&offset=${offset}`);
  };

  const limitChanged = (limit: number) => {
    router.push(`/codebreaker/scores?limit=${limit}&offset=0`);
  };

  return (
    <div id="code-breaker-scores" className="m-2">
      <h1>Code Breaker Scores</h1>
      <div>
        <div className="score-header">
          <div className="cell-left"></div>
          <div className="cell-center">User</div>
          <div className="cell-center">Status</div>
          <div className="cell-center">Score</div>
          <div className="cell-center">Colors</div>
          <div className="cell-right">Columns</div>
        </div>
        {Items.map((code_breaker: CodeBreaker) => (
          <CodeBreakerScoreRow
            key={code_breaker.id}
            code_breaker={code_breaker}
          />
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
