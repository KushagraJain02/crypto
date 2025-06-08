import React from "react";
import millify from "millify";
import { Collapse, Row, Col, Typography, Avatar, Card, Button } from "antd";
import HTMLReactParser from "html-react-parser";

import { useGetExchangesQuery } from "../services/cryptoApi";
import Loader from "./Loader";

const { Text, Title } = Typography;
const { Panel } = Collapse;

const Exchanges = () => {
  const { data, isFetching } = useGetExchangesQuery();
  const exchangesList = data?.data?.exchanges;

  if (isFetching) return <Loader />;

  if (!exchangesList || exchangesList.length === 0) {
    return (
      <div className="premium-feature-container">
        <Card className="premium-message-card">
          <Title level={3} className="premium-title">
            <span role="img" aria-label="locked">
              🔒
            </span>{" "}
            Unlock Premium Features
          </Title>
          <Text className="premium-description">
            The full list of cryptocurrency exchanges is available exclusively
            to premium subscribers. Upgrade your plan to get access to
            comprehensive exchange data, including detailed metrics and more!
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="exchanges-container">
      <Row className="exchanges-header-row" gutter={[0, 16]}>
        <Col span={6} className="exchanges-header-item">
          Exchanges
        </Col>
        <Col span={6} className="exchanges-header-item">
          24h Trade Volume
        </Col>
        <Col span={6} className="exchanges-header-item">
          Markets
        </Col>
        <Col span={6} className="exchanges-header-item">
          Change
        </Col>
      </Row>

      {/* List of Exchanges using Collapse */}
      <Row className="exchanges-list-row">
        {exchangesList.map((exchange) => (
          <Col span={24} key={exchange.uuid} className="exchange-item-col">
            <Card className="exchange-card" bordered={false}>
              <Collapse defaultActiveKey={["0"]} expandIconPosition="right">
                <Panel
                  key={exchange.uuid}
                  showArrow={false}
                  header={
                    <Row align="middle" className="exchange-panel-header">
                      <Col span={6}>
                        <Text className="exchange-rank-name">
                          <strong>{exchange.rank}.</strong>
                        </Text>
                        <Avatar
                          className="exchange-image"
                          src={exchange.iconUrl}
                          alt={`${exchange.name} icon`}
                        />
                        <Text className="exchange-rank-name">
                          <strong>{exchange.name}</strong>
                        </Text>
                      </Col>
                      <Col span={6} className="exchange-volume">
                        ${millify(exchange.volume)}
                      </Col>
                      <Col span={6} className="exchange-markets">
                        {millify(exchange.numberOfMarkets)}
                      </Col>
                      <Col span={6} className="exchange-market-share">
                        {millify(exchange.marketShare)}%
                      </Col>
                    </Row>
                  }
                >
                  {HTMLReactParser(
                    exchange.description || "<p>No description available.</p>"
                  )}
                </Panel>
              </Collapse>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Exchanges;
