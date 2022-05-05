import BN from "bn.js";
import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { formatNear } from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";

import CopyToClipboard from "../../beta/common/CopyToClipboard";
import Gas from "../../utils/Gas";
import TransactionStatus from "./TransactionStatus";

type Props = {
  transaction: any;
};

const Wrapper = styled("div", {
  backgroundColor: "$background",
});

const Content = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "$desktop",
  margin: "auto",
  paddingVertical: "$space-l",
  paddingHorizontal: 40,
  fontFamily: "Manrope",
});

const BaseInfo = styled("div", {
  display: "flex",
});

const Title = styled("div", {
  fontSize: 30,
  fontWeight: 600,
  lineHeight: "45px",
  color: "$textColor",
});

const TransactionHash = styled("div", {
  fontSize: 18,
  color: "$textColor",
  lineHeight: "27px",
  marginRight: 14,
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: "$space-s",
});

const NumericInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});
const NumericDivider = styled("div", {
  height: "100%",
  width: 1,
  marginHorizontal: "$space-l",
});

const AmountHeader = styled("div", {
  fontSize: "$font-s",
  color: "$backgroundTextColor",
});

const Amount = styled("div", {
  fontWeight: 500,
  fontSize: "$font-l",
  color: "$textColor",
  marginTop: "$space-m",
});

const TransactionHeader: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Content>
        <BaseInfo>
          <div>
            <Title>{t("common.transactions.transaction")}</Title>
            <BaseInfoDetails>
              <TransactionHash>
                {`${props.transaction.hash.slice(
                  0,
                  7
                )}...${props.transaction.hash.slice(-4)}`}
              </TransactionHash>
              <CopyToClipboard text={props.transaction.hash} />
              <TransactionStatus status={props.transaction.status} />
            </BaseInfoDetails>
          </div>
        </BaseInfo>
        <NumericInfo>
          <div>
            <AmountHeader>{t("pages.transaction.header.fee")}</AmountHeader>
            <Amount>{formatNear(props.transaction.transactionFee)}</Amount>
          </div>
          <NumericDivider />
          <div>
            <AmountHeader>
              {t("pages.transaction.header.attached")}
            </AmountHeader>
            <Amount>
              <Gas gas={new BN(props.transaction.gasAttached) || 0} />
            </Amount>
          </div>
          <NumericDivider />
          <div>
            <AmountHeader>{t("pages.transaction.header.burned")}</AmountHeader>
            <Amount>
              <Gas gas={new BN(props.transaction.gasUsed) || 0} />
            </Amount>
          </div>
          <NumericDivider />
          <div>
            <AmountHeader>{t("pages.transaction.header.when")}</AmountHeader>
            <Amount>
              {moment(props.transaction.created.timestamp).format(
                t("pages.transaction.dateFormat")
              )}
            </Amount>
          </div>
        </NumericInfo>
      </Content>
    </Wrapper>
  );
});

export default TransactionHeader;
