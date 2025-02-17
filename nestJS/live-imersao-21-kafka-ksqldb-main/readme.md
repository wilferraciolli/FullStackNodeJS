{
    "event": "order.created",
    "order_id": "XXXX",
    "customer_id": 1,
    "product_id": 1,
    "quantity": 1,
    "price": 100.0
}

CREATE STREAM orders_stream (
  order_id STRING,
  product_id STRING,
  quantity INT,
  price DOUBLE
) WITH (
  KAFKA_TOPIC = 'orders',
  VALUE_FORMAT = 'JSON',
  PARTITIONS = 1
);

CREATE TABLE orders_summary AS
SELECT
  'ALL_ORDERS' AS key,  -- Just a constant for the grouping
  COUNT(*) AS total_orders,
  SUM(quantity * price) AS total_revenue
FROM orders_stream
GROUP BY 'ALL_ORDERS'
EMIT CHANGES;


CREATE TABLE orders_summary_time AS
SELECT
  WINDOWSTART AS window_start,  -- Inclui o início da janela
  WINDOWEND AS window_end,      -- Inclui o fim da janela
  'ALL_ORDERS' AS key,  -- Just a constant for the grouping
  COUNT(*) AS total_orders,
  SUM(quantity * price) AS total_revenue
FROM orders_stream
WINDOW TUMBLING (SIZE 1 MINUTES)
GROUP BY 'ALL_ORDERS'
EMIT CHANGES;