import * as React from "react";
import { useTranslation } from "react-i18next";

import { styled } from "../../../libraries/styles";
import { formatNear } from "../../../libraries/formatting";
import { TransactionReceipt } from "../../../types/transaction";

import AccountLink from "../common/AccountLink";
import TransactionType from "./TransactionType";

type Props = {
  onClick: React.MouseEventHandler;
  receipt: TransactionReceipt;
};

const Row = styled("div", {
  width: "100%",
  padding: 20,
  display: "flex",
  background: "$textColor",
  boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
  borderRadius: 6,
});

const Arrow = styled("img", {
  width: 17,
});

const AccountInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: "1 0 auto",
});

const Divider = styled("div", {
  height: "100%",
  width: 1,
  marginHorizontal: "$space-m",
});

const AmountHeader = styled("div", {
  fontSize: "$font-s",
  color: "#616161",
  width: 125,
});

const Amount = styled("div", {
  fontWeight: 600,
  fontSize: 20,
  lineHeight: "30px",
  color: "#000000",
});

const Author = styled("div", {
  display: "flex",
  alignItems: "center",
});

const AccountLinkWrapper = styled("div", {
  color: "#0072ce",
  fontSize: 20,
  fontWeight: 600,
  lineHeight: "150%",
});

const Avatar = styled("div", {
  size: "$avatarSizeSmall",
  backgroundColor: "$avatarFallback",
  opacity: 0.2,
  borderRadius: "$round",
  marginRight: "$space-s",
});

const SuccessIcon = styled("img", {
  width: 11,
});

const Status = styled("div", {
  textAlign: "center",

  "& > div": {
    width: "auto",
  },
});

const Red = styled("div", {
  color: "#aa4710",
});

const Receipt: React.FC<Props> = React.memo(({ onClick, receipt }) => {
  const { t } = useTranslation();
  const status = Object.keys(receipt.status)[0];
  return (
    <Row onClick={onClick}>
      <TransactionType actions={receipt.actions} />
      <Divider />
      <AccountInfo>
        <div>
          <AmountHeader>{t("pages.transaction.activity.from")}</AmountHeader>
          <Amount>
            <Author>
              <Avatar />
              <AccountLinkWrapper>
                <AccountLink accountId={receipt.signerId} />
              </AccountLinkWrapper>
            </Author>
          </Amount>
        </div>
        <Divider />
        <Arrow src="/static/images/ic-from-to.svg" />
        <Divider />
        <div>
          <AmountHeader>{t("pages.transaction.activity.to")}</AmountHeader>
          <Amount>
            <Author>
              <Avatar />
              <AccountLinkWrapper>
                <AccountLink accountId={receipt.receiverId} />
              </AccountLinkWrapper>
            </Author>
          </Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>{t("pages.transaction.activity.amount")}</AmountHeader>
          <Amount>{receipt.deposit ? formatNear(receipt.deposit) : "0"}</Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>{t("pages.transaction.activity.fee")}</AmountHeader>
          <Amount>{formatNear(receipt.tokensBurnt)}</Amount>
        </div>
        <Divider />
        <Status>
          <AmountHeader>{t("pages.transaction.activity.status")}</AmountHeader>
          <Amount>
            {["Started", "SuccessValue", "SuccessReceiptId"].indexOf(status) >=
            0 ? (
              <>
                <SuccessIcon src="/static/images/icon-success.svg" />
              </>
            ) : (
              <Red>&#10005;</Red>
            )}
          </Amount>
        </Status>
      </AccountInfo>
    </Row>
  );
});

export default Receipt;
