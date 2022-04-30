import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import * as ReactQuery from "react-query";

import Content from "../../components/utils/Content";
import { useFetcher } from "../../hooks/use-fetcher";
import { styled } from "../../libraries/styles";

const Tokens = styled("div", {
  borderLeft: "1px solid black",
});

const Token = styled("div", {
  margin: 20,
  padding: 20,
  display: "flex",
});

const TokenElement = styled("div", {
  "& + &": {
    paddingTop: 12,
  },
});

const TokenImage = styled("img", {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "3px solid black",
  marginRight: 20,
});

const Pagination = styled("div", {
  margin: "12px 0",
  display: "flex",
});

const PageCursor = styled("div", {
  border: "1px solid black",
  padding: 12,
  borderRadius: 4,
  textTransform: "uppercase",
  cursor: "pointer",

  "& + &": {
    marginLeft: 12,
  },

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
        cursor: "default",
      },
    },
  },
});

const PAGE_LIMIT = 10;
const EMPTY_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";

const FungibleTokens: NextPage = React.memo(() => {
  const fetcher = useFetcher();
  const [page, setPage] = React.useState(0);
  const tokensAmountQuery = ReactQuery.useQuery(
    ["fungible-tokens-amount"],
    () => {
      return fetcher("fungible-tokens-amount", []);
    }
  );
  const tokensQuery = ReactQuery.useQuery(
    ["fungible-tokens", page],
    ({
      queryKey,
    }: ReactQuery.QueryFunctionContext<ReactQuery.QueryKey, number>) => {
      return fetcher("fungible-tokens", [
        {
          limit: PAGE_LIMIT,
          offset: (queryKey[1] as number) * PAGE_LIMIT,
        },
      ]);
    },
    {
      enabled: tokensAmountQuery.isSuccess,
    }
  );

  const onNextPage = React.useCallback(() => {
    setPage((page) => page + 1);
  }, [setPage]);
  const onPrevPage = React.useCallback(() => {
    setPage((page) => page - 1);
  }, [setPage]);

  const tokensAmount = tokensAmountQuery.data ?? 0;
  const isPrevPageAvailable = page !== 0;
  const isNextPageAvailable = page + 1 !== Math.ceil(tokensAmount / PAGE_LIMIT);

  return (
    <>
      <Head>
        <title>NEAR Explorer | Fungible tokens</title>
      </Head>
      <Content title={<h1>Contracts</h1>}>
        <Pagination>
          <PageCursor
            disabled={!isPrevPageAvailable}
            onClick={isPrevPageAvailable ? onPrevPage : undefined}
          >
            {"Prev page"}
          </PageCursor>
          <PageCursor
            disabled={!isNextPageAvailable}
            onClick={isNextPageAvailable ? onNextPage : undefined}
          >
            {"Next page"}
          </PageCursor>
        </Pagination>
        <Tokens>
          {tokensQuery.data ? (
            tokensQuery.data.map((token) => (
              <Token key={token.contractId}>
                <TokenImage src={token.icon || EMPTY_IMAGE} />
                <div>
                  <TokenElement>{token.name}</TokenElement>
                  <TokenElement>
                    {`Total supply: ${token.totalSupply.slice(
                      0,
                      -token.decimals
                    )}.${token.totalSupply.slice(-token.decimals)} ${
                      token.symbol
                    }`}
                  </TokenElement>
                </div>
              </Token>
            ))
          ) : (
            <div>Loading page {page + 1}..</div>
          )}
        </Tokens>
      </Content>
    </>
  );
});

export default FungibleTokens;
