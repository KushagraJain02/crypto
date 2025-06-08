import React, { useState, useMemo } from "react";
import { Typography, Row, Col, Card, Input } from "antd";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Helper to generate random past date within last 7 days
const getRandomPastDate = () => {
  const now = new Date();
  const pastTime =
    now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
  return new Date(pastTime);
};

const News = ({ simplified }) => {
  const count = simplified ? 6 : 100;

  // Hooks at top level
  const { data, error, isLoading } = useGetCryptoNewsQuery({
    newsCategory: "cryptocurrency",
    page: 0,
    size: count,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const articles = data?.data?.items || [];

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    const lowerSearch = searchTerm.toLowerCase();
    return articles.filter(
      (article) =>
        (article.title && article.title.toLowerCase().includes(lowerSearch)) ||
        (article.description &&
          article.description.toLowerCase().includes(lowerSearch)) ||
        (article.snippet && article.snippet.toLowerCase().includes(lowerSearch))
    );
  }, [searchTerm, articles]);

  if (isLoading)
    return (
      <Text
        style={{ textAlign: "center", display: "block", marginTop: 40 }}
        type="secondary"
      >
        Loading...
      </Text>
    );
  if (error)
    return (
      <Text
        type="danger"
        style={{ textAlign: "center", display: "block", marginTop: 40 }}
      >
        Error: {JSON.stringify(error)}
      </Text>
    );

  if (!articles.length)
    return (
      <Text
        style={{ textAlign: "center", display: "block", marginTop: 40 }}
        type="secondary"
      >
        No news found.
      </Text>
    );

  const articlesToShow = filteredArticles.slice(0, count);

  return (
    <>
      {!simplified && (
        <Search
          placeholder="Search cryptocurrency news"
          allowClear
          enterButton="Search"
          size="large"
          style={{
            marginBottom: 24,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
          }}
          onSearch={(value) => setSearchTerm(value)}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      )}

      <Row gutter={[24, 24]}>
        {articlesToShow.map((article, i) => {
          const randomPublishedTime = getRandomPastDate();

          return (
            <Col xs={24} sm={12} lg={8} key={article.link ?? `article-${i}`}>
              <Card
                hoverable
                styles={{
                  body: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  },
                }}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Title
                      level={4}
                      style={{
                        marginBottom: 12,
                        color: "#1890ff",
                        fontWeight: 600,
                        minHeight: 60,
                      }}
                    >
                      {article.title.length > 80
                        ? article.title.slice(0, 80) + "..."
                        : article.title}
                    </Title>

                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      style={{ color: "#444", flexShrink: 0 }}
                    >
                      {article.description ||
                        article.snippet ||
                        "No description"}
                    </Paragraph>
                  </div>

                  <Text
                    type="secondary"
                    style={{ fontSize: 12, fontWeight: 500, marginTop: 16 }}
                  >
                    {moment(randomPublishedTime).fromNow()}
                  </Text>
                </a>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default News;
